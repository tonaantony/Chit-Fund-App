// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { AuthService } from '@app/core/services/auth.service';
// import { UserService } from '@app/core/services/user.service';
// import { User } from '@app/shared/models/user.model';

// interface Group {
//   groupId: string;
//   groupName: string;
//   description: string;
//   memberCount: number;
//   status: string;
//   createdDate: Date;
// }

// @Component({
//   selector: 'app-user-dashboard',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './userdashboard.component.html',
//   styleUrls: ['./userdashboard.component.css']
// })
// export class UserDashboardComponent implements OnInit {
//   currentUser: User | null = null;
//   userGroups: Group[] = [];
//   isLoading: boolean = false;
//   error: string | null = null;
//   successMessage: string | null = null;

//   constructor(
//     private authService: AuthService,
//     private userService: UserService
//   ) {}

//   ngOnInit(): void {
//     this.loadDashboardData();
//   }

//   private loadDashboardData(): void {
//     this.isLoading = true;
//     this.error = null;
//     this.currentUser = this.authService.currentUser;

//     if (!this.currentUser?.userEmail) {
//       this.error = 'User session not found. Please login again.';
//       this.isLoading = false;
//       return;
//     }

//     this.userService.getUserGroups(this.currentUser.userEmail).subscribe({
//       next: (groups) => {
//         this.userGroups = groups;
//         this.isLoading = false;
//       },
//       error: (error) => {
//         console.error('Error loading dashboard data:', error);
//         this.error = 'Failed to load dashboard data. Please try again.';
//         this.isLoading = false;
//       }
//     });
//   }

//   refreshDashboard(): void {
//     this.loadDashboardData();
//   }

//   viewAllGroups(): void {
//     // This will be handled by router
//     window.location.href = '/groups';
//   }

//   viewGroupDetails(groupId: string): void {
//     window.location.href = `/groups/${groupId}`;
//   }

//   leaveGroup(groupId: string): void {
//     if (!this.currentUser?.userEmail) return;

//     this.isLoading = true;
//     this.userService.leaveGroup(this.currentUser.userEmail, groupId).subscribe({
//       next: () => {
//         this.successMessage = 'Successfully left the group';
//         this.loadDashboardData(); // Refresh the groups list
//       },
//       error: (error) => {
//         console.error('Error leaving group:', error);
//         this.error = 'Failed to leave group. Please try again.';
//         this.isLoading = false;
//       }
//     });
//   }

//   formatDate(date: Date): string {
//     return new Date(date).toLocaleDateString();
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { UserService } from '@app/core/services/user.service';
import { User } from '@app/shared/models/user.model';

interface Group {
  groupId: string;
  groupName: string;
  description: string;
  memberCount: number;
  status: string;
  createdDate: Date;
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
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    this.error = null;
    this.currentUser = this.authService.currentUser;

    if (!this.currentUser?.userEmail) {
      this.error = 'User session not found. Please login again.';
      this.isLoading = false;
      return;
    }

    this.userService.getUserGroups(this.currentUser.userEmail).subscribe({
      next: (groups) => {
        this.userGroups = groups;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.error = 'Failed to load dashboard data. Please try again.';
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
    if (!this.currentUser?.userEmail) return;

    this.isLoading = true;
    this.userService.leaveGroup(this.currentUser.userEmail, groupId).subscribe({
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
}