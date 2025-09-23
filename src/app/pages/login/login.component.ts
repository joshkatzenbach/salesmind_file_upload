import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/auth.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  returnUrl: string = '/';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Get return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // Wait for session check to complete before deciding what to do
    this.authService.sessionInfo$.subscribe(sessionInfo => {
      if (sessionInfo.isAuthenticated && sessionInfo.user) {
        this.router.navigate([this.returnUrl]);
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.error = null;

      const loginData: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(loginData).then(response => {
        this.isLoading = false;
        // Redirect immediately after successful login
        this.router.navigate([this.returnUrl]);
      }).catch(error => {
        this.isLoading = false;
        this.error = this.getErrorMessage(error);
        console.error('Login error:', error);
      });
    }
  }

  private getErrorMessage(error: any): string {
    if (error.error?.detail) {
      return error.error.detail;
    }
    if (error.status === 401) {
      return 'Invalid email or password.';
    }
    if (error.status === 0) {
      return 'Unable to connect to server. Please check your connection.';
    }
    return 'An error occurred during login. Please try again.';
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
