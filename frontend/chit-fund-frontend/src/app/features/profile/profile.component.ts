// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { ReactiveFormsModule } from '@angular/forms';
// import { Router } from '@angular/router'; 
// import { AuthService } from '@app/core/services/auth.service';
// import { UserService } from '@app/core/services/user.service';
// import { User } from '@app/shared/models/user.model';
// import { HttpErrorResponse } from '@angular/common/http';

// @Component({
//   selector: 'app-profile',
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './profile.component.html',
//   styleUrls: ['./profile.component.css'],
//   standalone: true,
// })
// export class ProfileComponent implements OnInit {
//   user: User | null = null;
//   error: string = '';

//   constructor(
//     private userService: UserService,
//     private authService: AuthService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     const currentUser = this.authService.currentUser;
    
//     if (currentUser && currentUser.userEmail) {
//       this.userService.getUserByEmail(currentUser.userEmail)
//         .subscribe({
//           next: (user: User) => {
//             this.user = user;
//           },
//           error: (err: HttpErrorResponse) => {
//             this.error = 'Failed to load user profile';
//             console.error(err);
//           }
//         });
//     } else {
//       this.error = 'No user data found.';
//     }
//   }

//   handleEditProfile(): void {
//     try {
//       this.router.navigate(['/editProfile']);
//     } catch (err: unknown) {
//       console.error('Error navigating to edit profile:', err);
//       this.error = 'Failed to navigate to edit profile.';
//     }
//   }
// }
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { AuthService } from '@app/core/services/auth.service';
import { UserService } from '@app/core/services/user.service';
import { User } from '@app/shared/models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  error: string = '';
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //this.loadUserProfile();
  }

//   private loadUserProfile(): void {
//     const currentUser = this.authService.currentUser;
    
//     if (!currentUser?.userEmail) {
//       this.error = 'No user data found. Please login again.';
//       this.router.navigate(['/login']);
//       return;
//     }

//     this.isLoading = true;
//     const token = this.authService.getToken();

//     if (!token) {
//       this.error = 'Authentication token not found. Please login again.';
//       this.router.navigate(['/login']);
//       return;
//     }

//     this.userService.getUserByEmail(currentUser.userEmail)
//       .pipe(
//         catchError((error: HttpErrorResponse) => {
//           console.error('Error fetching user profile:', error);
          
//           if (error.status === 401) {
//             this.error = 'Session expired. Please login again.';
//             this.authService.logout();
//             this.router.navigate(['/login']);
//           } else if (error.status === 404) {
//             this.error = 'User profile not found.';
//           } else {
//             this.error = 'Failed to load user profile. Please try again later.';
//           }
          
//           return of(null);
//         }),
//         finalize(() => {
//           this.isLoading = false;
//         })
//       )
//       .subscribe({
//         next: (user: User | null) => {
//           if (user) {
//             this.user = user;
//             // Update the stored user data in AuthService
//             this.authService.updateUser(user);
//           }
//         }
//       });
//   }

  handleEditProfile(): void {
    if (!this.user?.userEmail) {
      this.error = 'User data not available.';
      return;
    }

    try {
      this.router.navigate(['/editProfile']);
    } catch (err) {
      console.error('Error navigating to edit profile:', err);
      this.error = 'Failed to navigate to edit profile page.';
    }
  }

  // Add a refresh method that can be called after profile updates
  refreshProfile(): void {
    this.error = '';
    //this.loadUserProfile();
  }
}