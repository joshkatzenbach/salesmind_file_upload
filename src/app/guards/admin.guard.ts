import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.sessionInfo$.pipe(
      take(1),
      map(sessionInfo => {
        if (sessionInfo.isAuthenticated && this.authService.isAdmin()) {
          return true;
        } else {
          // Redirect to login page or show access denied
          if (!sessionInfo.isAuthenticated) {
            this.router.navigate(['/login'], { 
              queryParams: { returnUrl: state.url } 
            });
          } else {
            // User is logged in but doesn't have admin access
            this.router.navigate(['/unauthorized']);
          }
          return false;
        }
      })
    );
  }
}
