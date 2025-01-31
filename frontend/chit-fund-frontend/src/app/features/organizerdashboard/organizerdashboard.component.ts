// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { AuthService } from '@app/core/services/auth.service';
// import { UserService } from '@app/core/services/user.service';
// import { GroupService } from '@app/core/services/group.service';
// import { User } from '@app/shared/models/user.model';

// interface Group {
//   groupId: string;
//   groupName: string;
//   description: string;
//   memberCount: number;
//   status: string;
//   createdDate: Date;
//   joinRequests: string[];
// }

// @Component({
//   selector: 'app-organizer-dashboard',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './organizerdashboard.component.html',
//   styleUrls: ['./organizerdashboard.component.css']
// })
// export class OrganizerDashboardComponent implements OnInit {
//   currentUser: User | null = null;
//   organizerGroups: Group[] = [];
//   isLoading: boolean = false;
//   error: string | null = null;
//   successMessage: string | null = null;

//   constructor(
//     private authService: AuthService,
//     private userService: UserService,
//     private groupService: GroupService
//   ) {}

//   ngOnInit(): void {
//     this.loadDashboardData();
//   }

//   private loadDashboardData(): void {
//     this.isLoading = true;
//     this.error = null;
//     this.currentUser = this.authService.currentUser;

//     if (!this.currentUser?.userId) {
//       this.error = 'Organizer session not found. Please login again.';
//       this.isLoading = false;
//       return;
//     }

//     this.groupService.getGroupsByOrganizer(this.currentUser.userId).subscribe({
//       next: (groups) => {
//         this.organizerGroups = groups;
//         this.isLoading = false;
//       },
//       error: (error) => {
//         console.error('Error loading dashboard data:', error);
//         this.error = 'Failed to load dashboard data. Please try again.';
//         this.isLoading = false;
//       }
//     });
//   }

//   acceptJoinRequest(groupId: string, userId: string): void {
//     this.isLoading = true;
//     this.groupService.acceptJoinRequest(groupId, userId).subscribe({
//       next: () => {
//         this.successMessage = 'Join request accepted successfully';
//         this.loadDashboardData(); // Refresh the groups list
//       },
//       error: (error) => {
//         console.error('Error accepting join request:', error);
//         this.error = 'Failed to accept join request. Please try again.';
//         this.isLoading = false;
//       }
//     });
//   }

//   refreshDashboard(): void {
//     this.loadDashboardData();
//   }

//   viewAllGroups(): void {
//     window.location.href = '/groups';
//   }

//   viewGroupDetails(groupId: string): void {
//     window.location.href = `/groups/${groupId}`;
//   }

//   goToTransactions(): void {
//     window.location.href = '/transactions';
//   }

//   goToProfile(): void {
//     window.location.href = '/profile';
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
  isLoading: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;
  showCreateGroupModal = false;
  createGroupForm: FormGroup;
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private groupService: GroupService,
    private fb: FormBuilder
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

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    this.error = null;
    this.currentUser = this.authService.currentUser;

    if (!this.currentUser?.userId) {
      this.error = 'Organizer session not found. Please login again.';
      this.isLoading = false;
      return;
    }

    this.groupService.getGroupsByOrganizer(this.currentUser.userId).subscribe({
      next: (groups: Group[]) => {
        this.organizerGroups = groups;
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('Error loading dashboard data:', error);
        this.error = 'Failed to load dashboard data. Please try again.';
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
}