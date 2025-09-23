import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from './services/auth.service';
import { SessionInfo } from './models/auth.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'SalesMind';
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
        
        // If user is authenticated, check if they have access to any pages
        if (sessionInfo.isAuthenticated && sessionInfo.user) {
          this.checkUserAccess();
        }
      });
  }

  private checkUserAccess(): void {
    if (!this.sessionInfo.user) return;

    // Check what pages the user can access
    const canUpload = this.authService.canUploadDocuments();
    const canQuery = this.authService.canQueryDocuments();
    const canViewDocuments = this.authService.canViewAllDocuments();

    // If user has no access to any pages, show a message
    if (!canUpload && !canQuery && !canViewDocuments) {
      console.warn('User has no access to any pages');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
