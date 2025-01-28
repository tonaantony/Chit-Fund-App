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
//     const currentUser = this.authService.currentUsers;
    
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