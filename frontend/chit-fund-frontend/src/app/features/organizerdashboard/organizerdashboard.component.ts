import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { UserService } from '@app/core/services/user.service';
import { GroupService } from '@app/core/services/group.service';
import { User } from '@app/shared/models/user.model';
import { Group } from '@app/shared/models/group.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-organizer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './organizerdashboard.component.html',
  styleUrls: ['./organizerdashboard.component.css']
})
export class OrganizerDashboardComponent implements OnInit {
  currentUser: User | null = null;
  organizerGroups: Group[] = [];
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;
  showCreateGroupModal = false;
  createGroupForm: FormGroup;
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private groupService: GroupService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.createGroupForm = this.fb.group({
      groupName: ['', Validators.required],
      description: ['', Validators.required],
      groupType: ['', Validators.required],
      totalAmount: ['', [Validators.required, Validators.min(0)]],
      members: ['', [Validators.required, Validators.min(2)]],
      duration: ['', [Validators.required, Validators.min(1)]],
      interest: ['', [Validators.min(0), Validators.max(100)]]
    });
  }

  async ngOnInit(): Promise<void> {
    // Wait for auth to initialize
    await this.authService.initializeUserSession();
    
    // Get current user from storage if available
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    } else {
      this.currentUser = this.authService.currentUser;
    }

    console.log('Current user after init:', this.currentUser);

    if (!this.currentUser) {
      // Try to get user details if we have a token
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userEmail = localStorage.getItem('userEmail');
          if (userEmail) {
            const userDetails = await this.userService.getUserByEmail(userEmail).toPromise() as User;
            this.currentUser = userDetails;
            this.authService.updateUser(userDetails);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
          this.error = 'Failed to load user details';
          this.router.navigate(['/login']);
          return;
        }
      } else {
        this.router.navigate(['/login']);
        return;
      }
    }

    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    if (!this.currentUser?.userId) {
      console.error('No user ID available');
      this.error = 'Please login to view your dashboard';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.error = null;
    
    console.log('Loading groups for organizer:', this.currentUser.userId);
    
    this.groupService.getGroupsByOrganizer(this.currentUser.userId)
      .subscribe({
        next: (groups: Group[]) => {
          console.log('Raw groups data:', groups);
          this.organizerGroups = groups.map(group => ({
            ...group,
            status: group.status || 'ACTIVE',
            participants: group.participants || [],
            createdDate: group.createdDate ? new Date(group.createdDate) : new Date()
          }));
          console.log('Processed groups:', this.organizerGroups);
          this.isLoading = false;
        },
        error: (error: Error) => {
          console.error('Error loading groups:', error);
          this.error = 'Failed to load your groups. Please try again.';
          this.isLoading = false;
        }
      });
  }

  acceptJoinRequest(groupId: string, userId: string): void {
    this.isLoading = true;
    this.groupService.acceptJoinRequest(groupId, userId).subscribe({
      next: (response) => {
        this.successMessage = 'Join request accepted successfully';
        this.loadDashboardData(); // Refresh the groups list
      },
      error: (error: Error) => {
        console.error('Error accepting join request:', error);
        this.error = 'Failed to accept join request. Please try again.';
        this.isLoading = false;
      }
    });
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }

  viewAllGroups(): void {
    window.location.href = '/groups';
  }

  viewGroupDetails(groupId: string): void {
    window.location.href = `/groups/${groupId}`;
  }

  goToTransactions(): void {
    window.location.href = '/transactions';
  }

  goToProfile(): void {
    window.location.href = '/profile';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  openCreateGroupModal(): void {
    this.showCreateGroupModal = true;
  }

  closeCreateGroupModal(): void {
    this.showCreateGroupModal = false;
    this.createGroupForm.reset();
  }

  createGroup(): void {
    if (this.createGroupForm.invalid || !this.currentUser) {
      return;
    }

    this.isSubmitting = true;
    const newGroup: Group = {
      ...this.createGroupForm.value,
      organizerId: this.currentUser.userId,
      status: 'ACTIVE',
      participants: [],
      joinRequests: []
    };

    this.groupService.createGroup(newGroup).subscribe({
      next: (createdGroup) => {
        this.successMessage = 'Group created successfully!';
        this.loadDashboardData();
        this.closeCreateGroupModal();
        this.isSubmitting = false;
      },
      error: (error: Error) => {
        this.error = 'Failed to create group. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}