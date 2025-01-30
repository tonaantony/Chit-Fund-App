
// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule } from '@angular/router';
// import { AuthService } from '@app/core/services/auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css'],
//   imports: [CommonModule, ReactiveFormsModule, RouterModule],
// })
// export class LoginComponent {
//   loginForm: FormGroup;
//   selectedRole: string = '';
//   formSubmitted: boolean = false;
//   errorMessage: string = '';
//   isLoading: boolean = false;

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private router: Router
//   ) {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', Validators.required],
//       role: ['', Validators.required]
//     });
//   }

//   setRole(role: string) {
//     this.selectedRole = role;
//     this.loginForm.patchValue({ role: role });
//     // Clear error message when role is changed
//     this.errorMessage = '';
//   }

//   onSubmit() {
//     this.formSubmitted = true;
    
//     if (this.loginForm.valid && this.selectedRole) {
//       this.isLoading = true;
//       this.errorMessage = ''; // Clear any previous error messages
      
//       const { email, password, role } = this.loginForm.value;
      
//       this.authService.login(email, password).subscribe({
//         next: (response) => {
//           if (response && response.token) {
//             // Clear error message on successful login
//             this.errorMessage = '';
            
//             // Store the token and role
//             localStorage.setItem('token', response.token);
//             localStorage.setItem('userRole', role);

//             // Navigate based on role
//             this.navigateByRole(role);
//           } else {
//             this.errorMessage = 'Invalid response from server';
//           }
//         },
//         error: (error) => {
//           console.error('Login failed:', error);
//           this.errorMessage = this.getErrorMessage(error);
//           this.isLoading = false;
//         },
//         complete: () => {
//           this.isLoading = false;
//         }
//       });
//     } else {
//       this.handleFormErrors();
//     }
//   }

//   private navigateByRole(role: string) {
//     switch (role) {
//       case 'ADMIN':
//         this.router.navigate(['/admindashboard']);
//         break;
//       case 'ORGANIZER':
//         this.router.navigate(['/organizerdashboard']);
//         break;
//       case 'PARTICIPANT':
//         this.router.navigate(['/userdashboard']);
//         break;
//       default:
//         this.router.navigate(['/home']);
//     }
//   }

//   private getErrorMessage(error: any): string {
//     if (error.status === 401) {
//       return 'Invalid email or password';
//     } else if (error.status === 403) {
//       return 'Access denied. Please check your role';
//     } else if (error.error?.message) {
//       return error.error.message;
//     } else {
//       return 'An error occurred during login. Please try again';
//     }
//   }

//   private handleFormErrors() {
//     if (!this.loginForm.get('email')?.valid) {
//       this.errorMessage = 'Please enter a valid email address';
//     } else if (!this.loginForm.get('password')?.valid) {
//       this.errorMessage = 'Password is required';
//     } else if (!this.selectedRole) {
//       this.errorMessage = 'Please select a role';
//     }
//   }

//   // Clear error message when user starts typing
//   onInputChange() {
//     this.errorMessage = '';
//   }
// }

// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule } from '@angular/router';
// import { AuthService } from '@app/core/services/auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css'],
//   imports: [CommonModule, ReactiveFormsModule, RouterModule],
// })
// export class LoginComponent {
//   loginForm: FormGroup;
//   selectedRole: string = '';
//   formSubmitted: boolean = false;
//   errorMessage: string = '';
//   isLoading: boolean = false;

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private router: Router
//   ) {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', Validators.required],
//       role: ['', Validators.required]
//     });
//   }

//   setRole(role: string) {
//     this.selectedRole = role;
//     this.loginForm.patchValue({ role: role });
//     // Clear error message when role is changed
//     this.errorMessage = '';
//   }

//   onSubmit() {
//     this.formSubmitted = true;
    
//     if (this.loginForm.valid && this.selectedRole) {
//       this.isLoading = true;
//       this.errorMessage = ''; // Clear any previous error messages
      
//       const { email, password } = this.loginForm.value;
      
//       this.authService.login(email, password).subscribe({
//         next: (response) => {
//           if (response.token) {
//             // Clear error message on successful login
//             this.errorMessage = '';
            
//             // Navigate based on stored role
//             const role = this.authService.getRole();
//             this.navigateByRole(role);
//           } else {
//             this.errorMessage = 'Invalid response from server';
//           }
//         },
//         error: (error) => {
//           console.error('Login failed:', error);
//           this.errorMessage = this.getErrorMessage(error);
//           this.isLoading = false;
//         },
//         complete: () => {
//           this.isLoading = false;
//         }
//       });
//     } else {
//       this.handleFormErrors();
//     }
//   }

//   private navigateByRole(role: string | null) {
//     if (!role) {
//       this.errorMessage = 'Role not found. Please try again.';
//       return;
//     }

//     switch (role) {
//       case 'ADMIN':
//         this.router.navigate(['/admindashboard']);
//         break;
//       case 'ORGANIZER':
//         this.router.navigate(['/organizerdashboard']);
//         break;
//       case 'PARTICIPANT':
//         this.router.navigate(['/userdashboard']);
//         break;
//       default:
//         this.router.navigate(['/home']);
//     }
//   }

//   private getErrorMessage(error: any): string {
//     if (error.status === 401) {
//       return 'Invalid email or password';
//     } else if (error.status === 403) {
//       return 'Access denied. Please check your role';
//     } else if (error.error?.message) {
//       return error.error.message;
//     } else {
//       return 'An error occurred during login. Please try again';
//     }
//   }

//   private handleFormErrors() {
//     if (!this.loginForm.get('email')?.valid) {
//       this.errorMessage = 'Please enter a valid email address';
//     } else if (!this.loginForm.get('password')?.valid) {
//       this.errorMessage = 'Password is required';
//     } else if (!this.selectedRole) {
//       this.errorMessage = 'Please select a role';
//     }
//   }

//   // Clear error message when user starts typing
//   onInputChange() {
//     this.errorMessage = '';
//   }
// }

// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule } from '@angular/router';
// import { AuthService } from '@app/core/services/auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css'],
//   imports: [CommonModule, ReactiveFormsModule, RouterModule],
// })
// export class LoginComponent {
//   loginForm: FormGroup;
//   selectedRole: string = '';
//   formSubmitted: boolean = false;
//   errorMessage: string = '';
//   isLoading: boolean = false;

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private router: Router
//   ) {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', Validators.required],
//       role: ['', Validators.required]
//     });
//   }

//   setRole(role: string) {
//     this.selectedRole = role;
//     this.loginForm.patchValue({ role: role });
//     // Clear error message when role is changed
//     this.errorMessage = '';
//   }

//   onSubmit() {
//     this.formSubmitted = true;
    
//     if (this.loginForm.valid) {
//       this.isLoading = true;
//       this.errorMessage = ''; // Clear any previous error messages
      
//       const { email, password } = this.loginForm.value;
      
//       this.authService.login(email, password).subscribe({
//         next: (response) => {
//           if (response.token) {
//             // Clear error message on successful login
//             this.errorMessage = '';
            
//             // Navigate based on stored role
//             const role = this.authService.getRole();
//             this.navigateByRole(role);
//           } else {
//             this.errorMessage = 'Invalid response from server';
//           }
//         },
//         error: (error) => {
//           console.error('Login failed:', error);
//           this.errorMessage = this.getErrorMessage(error);
//           this.isLoading = false;
//         },
//         complete: () => {
//           this.isLoading = false;
//         }
//       });
//     } else {
//       this.handleFormErrors();
//     }
//   }

  // private navigateByRole(role: string | null) {
  //   if (!role) {
  //     this.errorMessage = 'Role not found. Please try again.';
  //     return;
  //   }

  //   switch (role) {
  //     case 'ADMIN':
  //       this.router.navigate(['/admindashboard']);
  //       break;
  //     case 'ORGANIZER':
  //       this.router.navigate(['/organizerdashboard']);
  //       break;
  //     case 'PARTICIPANT':
  //       this.router.navigate(['/userdashboard']);
  //       break;
  //     default:
  //       this.router.navigate(['/home']);
  //   }
  // }

//   private navigateByRole(role: string | null) {
//     if (!role) {
//       this.errorMessage = 'Role not found. Please try again.';
//       return;
//     }
  
//     console.log('Redirecting based on role:', role);
  
//     switch (role) {
//       case 'ADMIN':
//         this.router.navigate(['/admindashboard']);
//         break;
//       case 'ORGANIZER':
//         this.router.navigate(['/organizerdashboard']);
//         break;
//       case 'PARTICIPANT':
//         this.router.navigate(['/userdashboard']);
//         break;
//       default:
//         this.router.navigate(['/home']);
//     }
//   }

//   private getErrorMessage(error: any): string {
//     if (error.status === 401) {
//       return 'Invalid email or password';
//     } else if (error.status === 403) {
//       return 'Access denied. Please check your role';
//     } else if (error.error?.message) {
//       return error.error.message;
//     } else {
//       return 'An error occurred during login. Please try again';
//     }
//   }

//   private handleFormErrors() {
//     if (!this.loginForm.get('email')?.valid) {
//       this.errorMessage = 'Please enter a valid email address';
//     } else if (!this.loginForm.get('password')?.valid) {
//       this.errorMessage = 'Password is required';
//     } else if (!this.selectedRole) {
//       this.errorMessage = 'Please select a role';
//     }
//   }

//   // Clear error message when user starts typing
//   onInputChange() {
//     this.errorMessage = '';
//   }
// }

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  selectedRole: string = '';
  formSubmitted: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  setRole(role: string) {
    this.selectedRole = role;
    this.loginForm.patchValue({ role: role });
    // Clear error message when role is changed
    this.errorMessage = '';
  }

  onSubmit() {
    this.formSubmitted = true;
    
    if (this.loginForm.valid && this.selectedRole) {
      this.isLoading = true;
      this.errorMessage = ''; // Clear any previous error messages
      
      const { email, password, role } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: (response) => {
          if (response && response.token) {
            // Clear error message on successful login
            this.errorMessage = '';
            
            // Store the token and role
            localStorage.setItem('token', response.token);
            localStorage.setItem('userRole', role);

            // Navigate based on role
            this.navigateByRole(role);
          } else {
            this.errorMessage = 'Invalid response from server';
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.errorMessage = this.getErrorMessage(error);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.handleFormErrors();
    }
  }

  private navigateByRole(role: string) {
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin-dashboard']);
        break;
      case 'ORGANIZER':
        this.router.navigate(['/organizer-dashboard']);
        break;
      case 'PARTICIPANT':
        this.router.navigate(['/user-dashboard']);
        break;
      default:
        this.router.navigate(['/dashboard']);
    }
  }

  private getErrorMessage(error: any): string {
    if (error.status === 401) {
      return 'Invalid email or password';
    } else if (error.status === 403) {
      return 'Access denied. Please check your role';
    } else if (error.error?.message) {
      return error.error.message;
    } else {
      return 'An error occurred during login. Please try again';
    }
  }

  private handleFormErrors() {
    if (!this.loginForm.get('email')?.valid) {
      this.errorMessage = 'Please enter a valid email address';
    } else if (!this.loginForm.get('password')?.valid) {
      this.errorMessage = 'Password is required';
    } else if (!this.selectedRole) {
      this.errorMessage = 'Please select a role';
    }
  }

  // Clear error message when user starts typing
  onInputChange() {
    this.errorMessage = '';
  }
}