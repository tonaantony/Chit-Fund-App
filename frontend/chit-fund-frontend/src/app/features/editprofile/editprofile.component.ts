import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserService } from '@app/core/services/user.service';
import { AuthService } from '@app/core/services/auth.service';
import { User } from '@app/shared/models/user.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ]
})
export class EditProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadUserProfile();
  }

  private initForm() {
    this.profileForm = this.fb.group({
      userName: ['', [Validators.required]],
      userMobileNum: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      userAddress: ['', [Validators.required]]
    });
  }

  private async loadUserProfile() {
    this.isLoading = true;
    try {
      const currentUser = await this.authService.getCurrentUser();
      if (currentUser && currentUser.userEmail) {
        this.userService.getUserByEmail(currentUser.userEmail).subscribe({
          next: (user: User) => {
            this.profileForm.patchValue({
              userName: user.userName,
              userMobileNum: user.userMobileNum,
              userAddress: user.userAddress
            });
            this.isLoading = false;
          },
          error: (error) => {
            this.errorMessage = 'Failed to load user profile';
            this.isLoading = false;
          }
        });
      }
    } catch (error) {
      this.errorMessage = 'Failed to get current user';
      this.isLoading = false;
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      const currentUser = this.authService.currentUser;
      if (currentUser && currentUser.userEmail) {
        this.userService.updateUserProfile(currentUser.userEmail, this.profileForm.value).subscribe({
          next: (response: User) => {
            this.successMessage = 'Profile updated successfully';
            this.isLoading = false;
          },
          error: (error) => {
            this.errorMessage = 'Failed to update profile';
            this.isLoading = false;
          }
        });
      }
    }
  }
}
