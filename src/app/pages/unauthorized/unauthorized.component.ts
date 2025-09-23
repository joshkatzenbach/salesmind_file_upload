import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css']
})
export class UnauthorizedComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  goHome(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  getCurrentUser(): string {
    const sessionInfo = this.authService.getSessionInfo();
    if (sessionInfo.user) {
      // Use full_name if available, otherwise construct from first_name and last_name
      if (sessionInfo.user.full_name) {
        return sessionInfo.user.full_name;
      }
      if (sessionInfo.user.first_name && sessionInfo.user.last_name) {
        return `${sessionInfo.user.first_name} ${sessionInfo.user.last_name}`;
      }
      // Fallback if only one name is available
      if (sessionInfo.user.first_name) {
        return sessionInfo.user.first_name;
      }
      if (sessionInfo.user.last_name) {
        return sessionInfo.user.last_name;
      }
    }
    return 'User';
  }
}
