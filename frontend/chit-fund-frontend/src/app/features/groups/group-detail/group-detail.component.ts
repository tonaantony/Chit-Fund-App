import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { GroupService } from '@app/core/services/group.service';
import { AuthService } from '@app/core/services/auth.service';

interface Group {
  groupId: string;
  groupName: string;
  description: string;
  organizerId: string;
  members: number;
  startDate: string;  // Changed to string since it comes as ISO string from backend
  endDate: string;    // Changed to string since it comes as ISO string from backend
  participants: string[];
  interest: number;
  totalAmount: number;
  ticketValue: number;
  groupType: string;
  duration: number;
  joinRequests?: string[];
}

@Component({
  selector: 'app-group-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailsComponent implements OnInit {
  group: Group | null = null;
  loading = true;
  userId: string | null = null;
  canJoin = false;
  hasRequestedToJoin = false;
  isOrganizer = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private groupService: GroupService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    // Get current user from AuthService
    const currentUser = await this.authService.getCurrentUser();
    this.userId = currentUser?.userId || null;
    console.log('Current user:', currentUser);
    console.log('UserId:', this.userId);

    this.route.params.subscribe(params => {
      const groupId = params['id'];
      console.log('Group ID from route:', groupId);
      this.fetchGroupDetails(groupId);
    });
  }

  fetchGroupDetails(groupId: string): void {
    this.http.get<Group>(`http://localhost:8083/api/groups/${groupId}`)
      .subscribe({
        next: (data) => {
          console.log('Group data received:', data);
          this.group = {
            ...data,
            participants: data.participants || [], // Ensure participants is an array
            joinRequests: data.joinRequests || [] // Ensure joinRequests is an array
          };
          
          if (this.userId && this.group) {
            // Check if user can join
            this.canJoin = !this.group.participants.includes(this.userId) && 
                          this.group.organizerId !== this.userId;
            this.isOrganizer = this.group.organizerId === this.userId;
            
            console.log('Status check:', {
              userId: this.userId,
              participants: this.group.participants,
              organizerId: this.group.organizerId,
              canJoin: this.canJoin,
              isOrganizer: this.isOrganizer
            });
          } else {
            console.warn('No userId available for status check');
            this.canJoin = false;
            this.isOrganizer = false;
          }
          
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching group details:', error);
          this.loading = false;
        }
      });
  }

  requestToJoin(): void {
    if (!this.group || !this.userId) {
      console.error('Cannot request to join: missing group or userId');
      return;
    }

    const joinRequest = {
      groupId: this.group.groupId,
      userId: this.userId
    };

    console.log('Sending join request:', joinRequest);

    const headers = { 'Content-Type': 'application/json' };
    
    this.http.post('http://localhost:8083/api/groups/join', joinRequest, { headers })
      .subscribe({
        next: (response) => {
          console.log('Join request response:', response);
          this.hasRequestedToJoin = true;
          this.fetchGroupDetails(this.group!.groupId);
        },
        error: (error) => {
          console.error('Error sending join request:', error);
        }
      });
  }

  isParticipant(): boolean {
    if (!this.userId || !this.group?.participants) return false;
    return this.group.participants.includes(this.userId);
  }
}