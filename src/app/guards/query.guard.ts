import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class QueryGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    try {
      const sessionInfo = await firstValueFrom(this.authService.sessionInfo$);
      
      if (sessionInfo.isAuthenticated && this.authService.canQueryDocuments()) {
        return true;
      } else {
        // Redirect to login page or show access denied
        if (!sessionInfo.isAuthenticated) {
          this.router.navigate(['/login'], { 
            queryParams: { returnUrl: state.url } 
          });
        } else {
          // User is logged in but doesn't have query permission
          this.router.navigate(['/unauthorized']);
        }
        return false;
      }
    } catch (error) {
      console.error('Error in QueryGuard:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
