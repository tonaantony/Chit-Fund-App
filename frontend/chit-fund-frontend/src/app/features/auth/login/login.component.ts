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
  }

  onSubmit() {
    this.formSubmitted = true;
    
    if (this.loginForm.valid && this.selectedRole) {
      const { email, password, role } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: (response) => {
          // Store the token and role
          localStorage.setItem('token', response.token);
          localStorage.setItem('userRole', role);

          // Navigate based on role
          switch (role) {
            case 'ADMIN':
              this.router.navigate(['/admin-dashboard']);
              break;
            case 'ORGANIZER':
              this.router.navigate(['/organizer-dashboard']);
              break;
            case 'PARTICIPANTS':
              this.router.navigate(['/user-dashboard']);
              break;
            default:
              this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.errorMessage = 'Invalid credentials or server error';
        }
      });
    }
  }
}
