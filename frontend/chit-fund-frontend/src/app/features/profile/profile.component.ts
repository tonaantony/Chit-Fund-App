import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { User } from '@app/shared/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    try {
      this.user = this.authService.currentUser;
      if (!this.user) {
        this.user = await this.authService.getCurrentUser();
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }
}