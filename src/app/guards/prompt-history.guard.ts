import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PromptHistoryGuard implements CanActivate {
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
      
      // Check if user is authenticated
      if (!sessionInfo.isAuthenticated) {
        this.router.navigate(['/login'], { 
          queryParams: { returnUrl: state.url } 
        });
        return false;
      }

      // Check if user has admin level (level 2 or 3)
      if (!this.authService.hasAccessLevel('admin')) {
        this.router.navigate(['/unauthorized']);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in PromptHistoryGuard:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
