import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
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
      
      if (sessionInfo.isAuthenticated) {
        return true;
      } else {
        // Redirect to login page with return URL
        this.router.navigate(['/login'], { 
          queryParams: { returnUrl: state.url } 
        });
        return false;
      }
    } catch (error) {
      console.error('Error in AuthGuard:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
