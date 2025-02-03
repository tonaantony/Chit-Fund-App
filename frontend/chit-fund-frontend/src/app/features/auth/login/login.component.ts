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
    password: '',
    role: ''
  };
  roles = [
    { id: 'PARTICIPANT', label: 'Participant' },
    { id: 'ORGANIZER', label: 'Organizer' },
    { id: 'ADMIN', label: 'Admin' }
  ];
  isLoading = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.loginData.userEmail || !this.loginData.password || !this.loginData.role) {
      this.error = 'Please fill in all fields including role';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.authService.login(this.loginData)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: async () => {
          this.redirectBasedOnRole(this.loginData.role);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.error = error instanceof Error ? error.message : 'Login failed. Please try again.';
        },
      });
  }

  private redirectBasedOnRole(role: string): void {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'ORGANIZER':
        this.router.navigate(['/organizerdashboard']);
        break;
      case 'PARTICIPANT':
        this.router.navigate(['/userdashboard']);
        break;
      default:
        this.error = 'Invalid user role';
        this.router.navigate(['/login']);
    }
  }
}