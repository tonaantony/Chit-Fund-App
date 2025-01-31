import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule,FormsModule } from '@angular/forms';
import { UserService } from '@app/core/services/user.service';
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
  userEmail: string = ''; // You'll need to get this from your auth service
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService
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

  private loadUserProfile() {
    this.isLoading = true;
    this.userService.getUserByEmail(this.userEmail).subscribe({
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

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.userService.updateUserProfile(this.userEmail, this.profileForm.value).subscribe({
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
