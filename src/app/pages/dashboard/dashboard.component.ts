import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SessionInfo } from '../../models/auth.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  sessionInfo: SessionInfo = {
    isAuthenticated: false,
    user: null,
    accessLevel: null
  };
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.sessionInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe(sessionInfo => {
        this.sessionInfo = sessionInfo;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  canAccessUpload(): boolean {
    return this.authService.canUploadDocuments();
  }

  canAccessQuery(): boolean {
    return this.authService.canQueryDocuments();
  }

  canAccessDocuments(): boolean {
    return this.authService.canViewAllDocuments();
  }

  hasAnyAccess(): boolean {
    return this.canAccessUpload() || this.canAccessQuery() || this.canAccessDocuments();
  }
}
