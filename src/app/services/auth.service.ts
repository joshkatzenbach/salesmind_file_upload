import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, of, map, firstValueFrom } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthResponse, SessionInfo } from '../models/auth.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private sessionInfoSubject = new BehaviorSubject<SessionInfo>({
    isAuthenticated: false,
    user: null,
    accessLevel: null
  });

  public sessionInfo$ = this.sessionInfoSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check for existing session on service initialization
    this.checkSession();
  }

  /**
   * Register a new user
   */
  register(registerData: RegisterRequest): Promise<AuthResponse> {
    return firstValueFrom(this.http.post<User>(`${this.apiUrl}/auth/register`, registerData, {
      withCredentials: true // Important for session cookies
    })).then(user => {
      // Transform the user response to match AuthResponse interface
      const authResponse: AuthResponse = {
        user: user,
        message: 'Registration successful'
      };
      // Update session info on successful registration
      this.updateSessionInfo(user);
      return authResponse;
    });
  }

  /**
   * Login user and establish session
   */
  login(loginData: LoginRequest): Promise<AuthResponse> {
    return firstValueFrom(this.http.post<User>(`${this.apiUrl}/auth/login`, loginData, {
      withCredentials: true // Important for session cookies
    })).then(user => {

      const authResponse: AuthResponse = {
        user: user,
        message: 'Login successful'
      };
      // Update session info on successful login
      this.updateSessionInfo(user);
      return authResponse;
    });
  }

  /**
   * Logout user and clear session
   */
  logout(): Promise<any> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/auth/logout`, {}, {
      withCredentials: true
    })).then(() => {
      // Clear session info on logout
      this.clearSessionInfo();
    }).catch(error => {
      // Even if logout fails on server, clear local session
      this.clearSessionInfo();
      throw error;
    });
  }

  /**
   * Get current user information
   */
  getCurrentUser(): Promise<User> {
    return firstValueFrom(this.http.get<User>(`${this.apiUrl}/auth/me`, {
      withCredentials: true
    })).then(user => {
      this.updateSessionInfo(user);
      return user;
    });
  }

  /**
   * Check if user has required access level
   */
  hasAccessLevel(requiredLevel: string): boolean {
    const sessionInfo = this.sessionInfoSubject.value;
    if (!sessionInfo.isAuthenticated || !sessionInfo.user) {
      return false;
    }

    const accessLevels = ['user', 'admin', 'super_admin'];
    const userLevelIndex = accessLevels.indexOf(sessionInfo.user.access_level);
    const requiredLevelIndex = accessLevels.indexOf(requiredLevel);

    return userLevelIndex >= requiredLevelIndex;
  }

  /**
   * Check if user is admin or super admin
   */
  isAdmin(): boolean {
    return this.hasAccessLevel('admin');
  }

  /**
   * Check if user is super admin
   */
  isSuperAdmin(): boolean {
    return this.hasAccessLevel('super_admin');
  }

  /**
   * Check if user can upload documents (admin or super_admin only)
   */
  canUploadDocuments(): boolean {
    return this.isAdmin();
  }

  /**
   * Check if user can view all documents (admin or super_admin only)
   */
  canViewAllDocuments(): boolean {
    return this.isAdmin();
  }

  /**
   * Check if user can query documents
   * Admins and super admins always have query permission regardless of the flag
   */
  canQueryDocuments(): boolean {
    const sessionInfo = this.sessionInfoSubject.value;
    if (!sessionInfo.isAuthenticated || !sessionInfo.user) {
      return false;
    }
    
    // Admins and super admins always have query permission
    if (this.isAdmin()) {
      return true;
    }
    
    // Regular users need the query_permission flag
    return sessionInfo.user.query_permission;
  }

  /**
   * Get current session info
   */
  getSessionInfo(): SessionInfo {
    return this.sessionInfoSubject.value;
  }

  /**
   * Check for existing session by calling /me endpoint
   */
  private checkSession(): void {
    this.getCurrentUser().then(user => {
      // Session is valid, user is already logged in
      this.updateSessionInfo(user);
    }).catch(() => {
      // No valid session, user needs to login
      this.clearSessionInfo();
    });
  }

  /**
   * Update session information
   */
  private updateSessionInfo(user: User): void {
    this.sessionInfoSubject.next({
      isAuthenticated: true,
      user: user,
      accessLevel: user.access_level
    });
  }

  /**
   * Clear session information
   */
  clearSessionInfo(): void {
    this.sessionInfoSubject.next({
      isAuthenticated: false,
      user: null,
      accessLevel: null
    });
  }

  /**
   * Get all users (admin and super admin only)
   */
  getAllUsers(): Observable<{users: User[], total: number}> {
    return this.http.get<{users: User[], total: number}>(`${this.apiUrl}/users/`, {
      withCredentials: true
    });
  }

  /**
   * Update user permissions (admin and super admin only)
   */
  updateUserPermissions(userId: number, permissions: {access_level?: string, query_permission?: boolean}): Observable<{message: string, user: User}> {
    return this.http.put<{message: string, user: User}>(`${this.apiUrl}/users/${userId}/permissions`, permissions, {
      withCredentials: true
    });
  }

  /**
   * Get user by ID (admin and super admin only)
   */
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`, {
      withCredentials: true
    });
  }

  /**
   * Get prompt history (admin and super admin only)
   */
  getPromptHistory(params: {user_id?: number, days?: number, limit?: number}): Observable<{queries: any[], total: number, filters: any}> {
    const queryParams = new URLSearchParams();
    if (params.user_id) queryParams.set('user_id', params.user_id.toString());
    if (params.days) queryParams.set('days', params.days.toString());
    if (params.limit) queryParams.set('limit', params.limit.toString());
    
    return this.http.get<{queries: any[], total: number, filters: any}>(`${this.apiUrl}/prompt-history/?${queryParams}`, {
      withCredentials: true
    });
  }

  /**
   * Get users for filtering prompt history (admin and super admin only)
   */
  getUsersForFiltering(): Observable<{users: any[]}> {
    return this.http.get<{users: any[]}>(`${this.apiUrl}/prompt-history/users`, {
      withCredentials: true
    });
  }
}
