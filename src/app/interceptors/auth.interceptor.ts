import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to add credentials
    const authReq = req.clone({
      withCredentials: true // This ensures cookies are sent with requests
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Don't handle 401 errors for logout requests to prevent infinite loops
        if (error.status === 401 && !req.url.includes('/auth/logout')) {
          // Session expired or invalid - redirect to login
          const authService = this.injector.get(AuthService);
          const router = this.injector.get(Router);
          // Clear session locally without making another API call
          authService.clearSessionInfo();
          router.navigate(['/login']);
        }
        
        // Handle authorization errors
        if (error.status === 403) {
          // User doesn't have permission - redirect to unauthorized page
          const router = this.injector.get(Router);
          router.navigate(['/unauthorized']);
        }

        return throwError(() => error);
      })
    );
  }
}
