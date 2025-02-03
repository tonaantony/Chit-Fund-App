import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { UserService } from '@app/core/services/user.service';
import { User } from '@app/shared/models/user.model';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Group {
  groupId: string;
  groupName: string;
  description: string;
  memberCount: number;
  status: string;
  createdDate: Date;
  groupType: string;
  totalAmount: number;
  duration: number;
  interest: number;
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  currentUser: User | null = null;
  userGroups: Group[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    await this.initializeSession();
    this.loadDashboardData();
  }

  private async initializeSession(): Promise<void> {
    await this.authService.initializeUserSession();
    this.currentUser = this.authService.currentUser;
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    this.error = null;

    if (!this.currentUser?.userId) {
      this.error = 'User session not found. Please login again.';
      this.isLoading = false;
      return;
    }

    console.log('Current User:', this.currentUser);
    console.log('Fetching groups for user ID:', this.currentUser.userId);

    this.userService.getUserGroups(this.currentUser.userId).subscribe({
      next: (response: any) => {
        console.log('Groups response:', response);
        try {
          if (Array.isArray(response)) {
            // Extract the group names from the response strings
            const groupNames = response.map(groupString => {
              // Extract group name from format "Group A - description"
              const match = groupString.match(/^(Group \w+)/);
              return match ? match[1] : null;
            }).filter(name => name); // Remove null values

            console.log('Extracted group names:', groupNames);

            if (groupNames.length > 0) {
              const groupPromises = groupNames.map(groupName => 
                this.http.get<any>(`http://localhost:8083/api/groups/name/${encodeURIComponent(groupName)}`).pipe(
                  catchError(error => {
                    console.error(`Error fetching group ${groupName}:`, error);
                    return of(null);
                  })
                )
              );

              forkJoin(groupPromises).subscribe({
                next: (groupDetails) => {
                  this.userGroups = groupDetails
                    .filter(group => group)
                    .map(group => ({
                      groupId: group.groupId,
                      groupName: group.groupName,
                      description: group.description,
                      memberCount: group.members,
                      status: group.status || 'ACTIVE',
                      createdDate: new Date(group.startDate),
                      groupType: group.groupType,
                      totalAmount: group.totalAmount,
                      duration: group.duration,
                      interest: group.interest
                    }));
                  console.log('Processed groups:', this.userGroups);
                  this.isLoading = false;
                },
                error: (error) => {
                  console.error('Error fetching group details:', error);
                  this.error = 'Failed to load group details';
                  this.isLoading = false;
                }
              });
            } else {
              this.userGroups = [];
              this.isLoading = false;
            }
          } else {
            this.userGroups = [];
            console.warn('Empty or invalid response format:', response);
            this.isLoading = false;
          }
        } catch (err) {
          console.error('Error processing groups:', err);
          this.error = 'Error processing group data';
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.error = error.error?.message || 'Failed to load dashboard data. Please try again.';
        this.isLoading = false;
      }
    });
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }

  viewAllGroups(): void {
    // This will be handled by router
    window.location.href = '/groups';
  }

  viewGroupDetails(groupId: string): void {
    window.location.href = `/groups/${groupId}`;
  }

  leaveGroup(groupId: string): void {
    if (!this.currentUser?.userId) return;

    this.isLoading = true;
    this.userService.leaveGroup(this.currentUser.userId, groupId).subscribe({
      next: () => {
        this.successMessage = 'Successfully left the group';
        this.loadDashboardData(); // Refresh the groups list
      },
      error: (error) => {
        console.error('Error leaving group:', error);
        this.error = 'Failed to leave group. Please try again.';
        this.isLoading = false;
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  goToTransactions(): void {
    // Redirect to transactions page
    window.location.href = '/transactions';
  }

  goToProfile(): void {
    // Redirect to profile page
    window.location.href = '/profile';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}