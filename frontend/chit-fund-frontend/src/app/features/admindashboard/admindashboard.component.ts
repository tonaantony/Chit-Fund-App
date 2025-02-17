import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { UserService } from '@app/core/services/user.service';
import { GroupService } from '@app/core/services/group.service';
import { User } from '@app/shared/models/user.model';
import { Group } from '@app/shared/models/group.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;
  allUsers: User[] = [];
  allGroups: Group[] = [];
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;
  
  // Stats
  totalUsers = 0;
  totalGroups = 0;
  totalOrganizers = 0;
  totalParticipants = 0;
  activeGroups = 0;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private groupService: GroupService,
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
    
    if (!this.currentUser || this.currentUser.userRole !== 'ADMIN') {
      this.router.navigate(['/login']);
    }
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    this.error = null;

    // Load users
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.allUsers = users;
        this.calculateUserStats();
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.error = 'Failed to load users';
      }
    });

    // Load groups
    this.groupService.getAllGroups().subscribe({
      next: (groups: Group[]) => {
        this.allGroups = groups;
        this.calculateGroupStats();
      },
      error: (error) => {
        console.error('Error loading groups:', error);
        this.error = 'Failed to load groups';
      }
    });

    this.isLoading = false;
  }

  private calculateUserStats(): void {
    this.totalUsers = this.allUsers.length;
    this.totalOrganizers = this.allUsers.filter(user => user.userRole === 'ORGANIZER').length;
    this.totalParticipants = this.allUsers.filter(user => user.userRole === 'PARTICIPANT').length;
  }

  private calculateGroupStats(): void {
    this.totalGroups = this.allGroups.length;
    this.activeGroups = this.allGroups.filter(group => group.status === 'ACTIVE').length;
  }

  viewUserDetails(userId: string): void {
    this.router.navigate(['/profile'], { queryParams: { userId: userId } });
  }

  viewGroupDetails(groupId: string): void {
    this.router.navigate(['/groups', groupId]);
  }

  deactivateUser(userId: string): void {
    if (confirm('Are you sure you want to deactivate this user?')) {
      this.userService.deactivateUser(userId).subscribe({
        next: () => {
          this.successMessage = 'User deactivated successfully';
          this.loadDashboardData();
        },
        error: (error: Error) => {
          console.error('Error deactivating user:', error);
          this.error = 'Failed to deactivate user';
        }
      });
    }
  }

  deactivateGroup(groupId: string): void {
    if (confirm('Are you sure you want to deactivate this group?')) {
      this.groupService.deactivateGroup(groupId).subscribe({
        next: () => {
          this.successMessage = 'Group deactivated successfully';
          this.loadDashboardData();
        },
        error: (error: Error) => {
          console.error('Error deactivating group:', error);
          this.error = 'Failed to deactivate group';
        }
      });
    }
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}