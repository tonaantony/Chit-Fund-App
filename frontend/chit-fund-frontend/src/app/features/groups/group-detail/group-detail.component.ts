import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Group {
  groupId: string;
  groupName: string;
  groupType: string;
  interest: number;
  organizerId: string;
  members: number;
  duration: number;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  ticketValue: number;
  participants: string[];
  description: string;
}

@Component({
  selector: 'app-group-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailsComponent implements OnInit {
  group: Group | null = null;
  loading = true;
  userId = localStorage.getItem('userId');

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const groupId = params['id'];
      this.fetchGroupDetails(groupId);
    });
  }

  fetchGroupDetails(groupId: string): void {
    this.http.get<Group>(`http://localhost:8083/api/groups/${groupId}`)
      .subscribe({
        next: (data) => {
          this.group = {
            ...data,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate)
          };
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching group details:', error);
          this.loading = false;
        }
      });
  }

  requestToJoin(): void {
    if (!this.group || !this.userId) return;

    this.http.post('http://localhost:8083/api/groups/join', {
      groupId: this.group.groupId,
      userId: this.userId
    }).subscribe({
      next: () => alert('Join request sent successfully!'),
      error: (error) => {
        console.error('Error sending join request:', error);
        alert('Failed to send join request');
      }
    });
  }
}