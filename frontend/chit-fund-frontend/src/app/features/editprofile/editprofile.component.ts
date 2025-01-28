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
//   user = inject(AuthService).currentUsers; // Fetch the current user data
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
