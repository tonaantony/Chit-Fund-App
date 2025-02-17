import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { User } from '@app/shared/models/user.model';
import { UserService } from '@app/core/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    try {
      const userId = this.route.snapshot.queryParams['userId'];
      if (userId) {
        // If userId is provided, fetch that user's profile
        this.userService.getUserById(userId).subscribe(
          user => this.user = user
        );
      } else {
        // Otherwise show current user's profile
        this.user = this.authService.currentUser;
        if (!this.user) {
          this.user = await this.authService.getCurrentUser();
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }
}