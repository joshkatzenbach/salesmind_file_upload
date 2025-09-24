import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SessionInfo, User } from '../../models/auth.interface';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit, OnDestroy {
  sessionInfo: SessionInfo = {
    isAuthenticated: false,
    user: null,
    accessLevel: null
  };
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.sessionInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe(sessionInfo => {
        console.log('Side menu received session info:', sessionInfo);
        this.sessionInfo = sessionInfo;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    }).catch(error => {
      console.error('Logout error:', error);
      // Still navigate to login even if logout fails
      this.router.navigate(['/login']);
    });
  }

  getUserDisplayName(): string {
    if (this.sessionInfo.user) {
      // Use full_name if available, otherwise construct from first_name and last_name
      if (this.sessionInfo.user.full_name) {
        return this.sessionInfo.user.full_name;
      }
      if (this.sessionInfo.user.first_name && this.sessionInfo.user.last_name) {
        return `${this.sessionInfo.user.first_name} ${this.sessionInfo.user.last_name}`;
      }
      // Fallback if only one name is available
      if (this.sessionInfo.user.first_name) {
        return this.sessionInfo.user.first_name;
      }
      if (this.sessionInfo.user.last_name) {
        return this.sessionInfo.user.last_name;
      }
    }
    return 'User';
  }

  canAccessDocuments(): boolean {
    return this.authService.canViewAllDocuments();
  }

  canAccessUpload(): boolean {
    return this.authService.canUploadDocuments();
  }

  canAccessQuery(): boolean {
    return this.authService.canQueryDocuments();
  }

  canManageUsers(): boolean {
    return this.authService.hasAccessLevel('admin');
  }

  canViewPromptHistory(): boolean {
    return this.authService.hasAccessLevel('admin');
  }
}
