import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.interface';

interface UserWithPermissions extends User {
  isUpdating?: boolean;
}

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit, OnDestroy {
  users: UserWithPermissions[] = [];
  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    
    firstValueFrom(this.authService.getAllUsers())
      .then(response => {
        this.users = response.users.map(user => ({ ...user, isUpdating: false }));
        this.loading = false;
      })
      .catch(error => {
        console.error('Error loading users:', error);
        this.error = 'Failed to load users. Please try again.';
        this.loading = false;
      });
  }

  toggleQueryPermission(user: UserWithPermissions): void {
    if (user.isUpdating) return;

    user.isUpdating = true;
    const newPermission = !user.query_permission;

    firstValueFrom(this.authService.updateUserPermissions(user.id, {
      query_permission: newPermission
    }))
    .then(response => {
      user.query_permission = response.user.query_permission;
      user.isUpdating = false;
    })
    .catch(error => {
      console.error('Error updating query permission:', error);
      user.isUpdating = false;
      this.error = 'Failed to update query permission. Please try again.';
    });
  }

  updateAccessLevel(user: UserWithPermissions, newLevel: string): void {
    if (user.isUpdating) return;

    user.isUpdating = true;
    const accessLevelMap: { [key: string]: string } = {
      '1': 'user',
      '2': 'admin', 
      '3': 'super_admin'
    };

    firstValueFrom(this.authService.updateUserPermissions(user.id, {
      access_level: accessLevelMap[newLevel]
    }))
    .then(response => {
      user.access_level = response.user.access_level;
      user.isUpdating = false;
    })
    .catch(error => {
      console.error('Error updating access level:', error);
      user.isUpdating = false;
      this.error = 'Failed to update access level. Please try again.';
    });
  }

  getAccessLevelNumber(accessLevel: string): string {
    const levelMap: { [key: string]: string } = {
      'user': '1',
      'admin': '2',
      'super_admin': '3'
    };
    return levelMap[accessLevel] || '1';
  }

  getAccessLevelLabel(accessLevel: string): string {
    const labelMap: { [key: string]: string } = {
      'user': 'User (Level 1)',
      'admin': 'Admin (Level 2)',
      'super_admin': 'Super Admin (Level 3)'
    };
    return labelMap[accessLevel] || 'User (Level 1)';
  }

  canManageUsers(): boolean {
    return this.authService.hasAccessLevel('admin');
  }

  canChangeAccessLevels(): boolean {
    return this.authService.hasAccessLevel('super_admin');
  }

  canModifyUser(user: UserWithPermissions): boolean {
    const currentUser = this.authService.getSessionInfo().user;
    if (!currentUser) return false;

    // Super admins can modify anyone except themselves
    if (currentUser.access_level === 'super_admin') {
      return user.id !== currentUser.id;
    }
    
    // Admins can only modify users (not other admins/super admins)
    if (currentUser.access_level === 'admin') {
      return user.access_level === 'user';
    }

    return false;
  }

  canModifyQueryPermission(user: UserWithPermissions): boolean {
    const currentUser = this.authService.getSessionInfo().user;
    if (!currentUser) return false;

    // Can't modify query permission for admins/super admins (they always have it)
    if (user.access_level === 'admin' || user.access_level === 'super_admin') {
      return false;
    }

    // Can modify query permission for regular users
    return this.canModifyUser(user);
  }

  canChangeAccessLevel(user: UserWithPermissions): boolean {
    const currentUser = this.authService.getSessionInfo().user;
    if (!currentUser) return false;

    // Super admins can change access levels of others, but not their own
    if (currentUser.access_level === 'super_admin') {
      return user.id !== currentUser.id;
    }

    // Only super admins can change access levels
    return false;
  }

  isCurrentUser(user: UserWithPermissions): boolean {
    const currentUser = this.authService.getSessionInfo().user;
    return currentUser ? user.id === currentUser.id : false;
  }

  hasEffectiveQueryPermission(user: UserWithPermissions): boolean {
    // Admins and super admins always have query permission
    if (user.access_level === 'admin' || user.access_level === 'super_admin') {
      return true;
    }
    // Regular users need the query_permission flag
    return user.query_permission;
  }

  refreshUsers(): void {
    this.loadUsers();
  }
}
