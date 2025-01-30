// import { Component, OnInit, inject } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { AuthService } from '@app/core/services/auth.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-edit-profile',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './editprofile.component.html',
//   styleUrls: ['./editprofile.component.css'],
// })
// export class EditProfileComponent implements OnInit {
//   formData: FormGroup;
//   error: string | null = null;
//   user = inject(AuthService); // Fetch the current user data
//   private http = inject(HttpClient);
//   private router = inject(Router);
//   private authService = inject(AuthService);

//   constructor(private fb: FormBuilder) {
//     this.formData = this.fb.group({
//       userMobileNum: ['', [Validators.required]],
//       userAddress: ['', [Validators.required]],
//     });
//   }

//   ngOnInit() {
//     if (!this.user) {
//       this.error = 'No user data found.';
//       return;
//     }

//     // Pre-fill the form with the user's current data
//     this.formData.patchValue({
//       userMobileNum: this.user.userMobileNum,
//       userAddress: this.user.userAddress,
//     });
//   }

//   handleSubmit() {
//     if (this.formData.invalid) {
//       return;
//     }

//     const payload = this.formData.value;

//     this.http
//   .put(`http://localhost:3000/api/users/editprofile/${this.user?.userEmail}`, payload, {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${this.authService.getToken()}`,
//     },
//     withCredentials: true,
//   })
//   .subscribe({
//     next: (response: any) => {
//       console.log('Profile updated successfully:', response);
//       this.authService.updateUser(response); // Use the existing updateUser method
//       this.router.navigate(['/profile']);
//     },
//     error: (err) => {
//       console.error('Error updating profile:', err);
//       this.error = 'Failed to update profile.';
//     },
//   });

//   }
// }

// import { Component, OnInit, inject } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '@app/core/services/auth.service';
// import { CommonModule } from '@angular/common';
// import { UserService } from '@app/core/services/user.service';

// @Component({
//   selector: 'app-edit-profile',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './editprofile.component.html',
//   styleUrls: ['./editprofile.component.css']
// })
// export class EditProfileComponent implements OnInit {
//   profileForm: FormGroup;
//   isLoading = false;
//   errorMessage: string | null = null;
//   successMessage: string | null = null;

//   private userService = inject(UserService);
//   private authService = inject(AuthService);
//   private router = inject(Router);

//   constructor(private fb: FormBuilder) {
//     this.profileForm = this.fb.group({
//       userName: ['', [Validators.required, Validators.minLength(2)]],
//       userMobileNum: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
//       userAddress: ['', [Validators.required, Validators.minLength(5)]]
//     });
//   }

//   ngOnInit() {
//     const currentUser = this.authService.currentUser;
//     if (!currentUser) {
//       this.router.navigate(['/login']);
//       return;
//     }

//     this.profileForm.patchValue({
//       userName: currentUser.userName,
//       userMobileNum: currentUser.userMobileNum,
//       userAddress: currentUser.userAddress
//     });
//   }

//   onSubmit() {
//     if (this.profileForm.valid) {
//       this.isLoading = true;
//       this.errorMessage = null;
//       this.successMessage = null;

//       const currentUser = this.authService.currentUser;
//       if (!currentUser?.userEmail) {
//         this.errorMessage = 'User email not found';
//         return;
//       }

//       const updatedData = {
//         ...this.profileForm.value,
//         userEmail: currentUser.userEmail
//       };

//       this.userService.updateProfile(currentUser.userEmail, updatedData)
//         .subscribe({
//           next: (response) => {
//             this.authService.updateUser(response);
//             this.successMessage = 'Profile updated successfully';
//             setTimeout(() => {
//               this.router.navigate(['/profile']);
//             }, 1500);
//           },
//           error: (error) => {
//             this.errorMessage = error.message || 'Failed to update profile';
//             this.isLoading = false;
//           },
//           complete: () => {
//             this.isLoading = false;
//           }
//         });
//     } else {
//       this.markFormGroupTouched(this.profileForm);
//     }
//   }

//   private markFormGroupTouched(formGroup: FormGroup) {
//     Object.values(formGroup.controls).forEach(control => {
//       control.markAsTouched();
//       if (control instanceof FormGroup) {
//         this.markFormGroupTouched(control);
//       }
//     });
//   }

//   getErrorMessage(fieldName: string): string {
//     const control = this.profileForm.get(fieldName);
//     if (control?.errors && control.touched) {
//       if (control.errors['required']) {
//         return `${fieldName} is required`;
//       }
//       if (control.errors['minlength']) {
//         return `${fieldName} must be at least ${control.errors['minlength'].requiredLength} characters`;
//       }
//       if (control.errors['pattern']) {
//         return 'Please enter a valid mobile number';
//       }
//     }
//     return '';
//   }
// }