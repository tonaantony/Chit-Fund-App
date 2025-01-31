// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';
// import { AuthService } from '@app/core/services/auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent implements OnInit {
//   loginData = {
//     userEmail: '',
//     password: ''
//   };
//   isLoading = false;
//   error: string | null = null;

//   constructor(
//     private authService: AuthService,
//     private router: Router
//   ) {}

//   async ngOnInit() {
//     const isLoggedIn = await this.authService.isLoggedIn();
//     if (isLoggedIn) {
//       const role = await this.authService.getRole();
//       if (role) {
//         this.redirectBasedOnRole(role);
//       }
//     }
//   }

//   onSubmit(): void {
//     if (!this.loginData.userEmail || !this.loginData.password) {
//       this.error = 'Please fill in all fields';
//       return;
//     }

//     this.isLoading = true;
//     this.error = null;

//     this.authService.login(this.loginData).subscribe({
//       next: (token) => {
//         this.authService.getUserDetails().subscribe({
//           next: async (userDetails) => {
//             this.isLoading = false;
//             const role = await this.authService.getRole();
//             if (role) {
//               this.redirectBasedOnRole(role);
//             }
//           },
//           error: (error) => {
//             this.isLoading = false;
//             this.error = 'Failed to get user details';
//           }
//         });
//       },
//       error: (error) => {
//         this.isLoading = false;
//         this.error = error.message || 'Login failed. Please try again.';
//       }
//     });
//   }

//   private redirectBasedOnRole(role: string): void {
//     switch (role.toUpperCase()) {
//       case 'ADMIN':
//         this.router.navigate(['/admin/dashboard']);
//         break;
//       case 'ORGANIZER':
//         this.router.navigate(['/organizerdashboard']);
//         break;
//       case 'PARTICIPANT':
//         this.router.navigate(['/userdashboard']);
//         break;
//       default:
//         this.router.navigate(['/login']);
//     }
//   }
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    userEmail: '',
    password: ''
  };
  isLoading = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.loginData.userEmail || !this.loginData.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.authService.login(this.loginData)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          if (response && response.userRole) {
            this.redirectBasedOnRole(response.userRole.name);
          } else {
            this.error = 'Invalid user role received';
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.error = error.message || 'Login failed. Please try again.';
        }
      });
  }

  private redirectBasedOnRole(role: string): void {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'ORGANIZER':
        this.router.navigate(['/organizer/dashboard']);
        break;
      case 'PARTICIPANT':
        this.router.navigate(['/user/dashboard']);
        break;
      default:
        this.error = 'Invalid user role';
        this.router.navigate(['/login']);
    }
  }
}