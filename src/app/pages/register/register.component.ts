import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/auth.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Wait for session check to complete before deciding what to do
    this.authService.sessionInfo$.pipe(
      filter(sessionInfo => {
        // Wait for either authenticated state or confirmed unauthenticated state
        return sessionInfo.isAuthenticated || (sessionInfo.user === null && !sessionInfo.isAuthenticated);
      }),
      take(1)
    ).subscribe(sessionInfo => {
      console.log('Register component received session info:', sessionInfo);
      if (sessionInfo.isAuthenticated && sessionInfo.user) {
        console.log('User is authenticated, redirecting to dashboard');
        this.router.navigate(['/']);
      } else {
        console.log('User is not authenticated, showing register form');
      }
    });
  }

  /**
   * Custom validator to check if passwords match
   */
  passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirm_password');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    
    return null;
  }


  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.error = null;

      const registerData: RegisterRequest = {
        first_name: this.registerForm.value.first_name,
        last_name: this.registerForm.value.last_name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          // Wait for session info to be updated before redirecting
          this.authService.sessionInfo$.pipe(
            filter(sessionInfo => sessionInfo.isAuthenticated && sessionInfo.user !== null),
            take(1)
          ).subscribe(() => {
            this.router.navigate(['/']);
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.error = this.getErrorMessage(error);
          console.error('Registration error:', error);
        }
      });
    }
  }

  private getErrorMessage(error: any): string {
    if (error.error?.detail) {
      return error.error.detail;
    }
    if (error.status === 400) {
      return 'Please check your input and try again.';
    }
    if (error.status === 409) {
      return 'An account with this email already exists.';
    }
    if (error.status === 0) {
      return 'Unable to connect to server. Please check your connection.';
    }
    return 'An error occurred during registration. Please try again.';
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field.errors?.['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors?.['minlength']) {
        const minLength = field.errors?.['minlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`;
      }
      if (field.errors?.['email']) {
        return 'Please enter a valid email address';
      }
    }
    return '';
  }

  getPasswordMatchError(): string {
    if (this.registerForm.errors?.['passwordMismatch'] && 
        this.registerForm.get('confirm_password')?.touched) {
      return 'Passwords do not match';
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'first_name': 'First name',
      'last_name': 'Last name',
      'email': 'Email',
      'password': 'Password',
      'confirm_password': 'Confirm password'
    };
    return labels[fieldName] || fieldName;
  }
}
