import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

interface QueryRecord {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  query: string;
  created_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  access_level: string;
}

interface PromptHistoryResponse {
  queries: QueryRecord[];
  total: number;
  filters: {
    user_id: number | null;
    days: number;
    limit: number;
  };
}

interface UsersResponse {
  users: User[];
}

@Component({
  selector: 'app-prompt-history',
  templateUrl: './prompt-history.component.html',
  styleUrls: ['./prompt-history.component.css']
})
export class PromptHistoryComponent implements OnInit, OnDestroy {
  queries: QueryRecord[] = [];
  users: User[] = [];
  loading = true;
  error: string | null = null;
  
  // Filter options
  selectedUserId: number | null = null;
  selectedDays = 30;
  limit = 100;
  
  // Available filter options
  dayOptions = [
    { value: 1, label: 'Last 24 hours' },
    { value: 7, label: 'Last 7 days' },
    { value: 30, label: 'Last 30 days' },
    { value: 90, label: 'Last 90 days' }
  ];
  
  limitOptions = [
    { value: 50, label: '50 results' },
    { value: 100, label: '100 results' },
    { value: 200, label: '200 results' },
    { value: 500, label: '500 results' }
  ];
  
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadQueries();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    firstValueFrom(this.authService.getUsersForFiltering())
      .then(response => {
        this.users = response.users;
      })
      .catch(error => {
        console.error('Error loading users:', error);
        this.error = 'Failed to load users for filtering.';
      });
  }

  loadQueries(): void {
    this.loading = true;
    this.error = null;
    
    const params: any = {
      days: this.selectedDays,
      limit: this.limit
    };
    
    if (this.selectedUserId) {
      params.user_id = this.selectedUserId;
    }
    
    firstValueFrom(this.authService.getPromptHistory(params))
      .then(response => {
        this.queries = response.queries;
        this.loading = false;
      })
      .catch(error => {
        console.error('Error loading queries:', error);
        this.error = 'Failed to load prompt history. Please try again.';
        this.loading = false;
      });
  }

  onUserFilterChange(): void {
    this.loadQueries();
  }

  onDaysFilterChange(): void {
    this.loadQueries();
  }

  onLimitChange(): void {
    this.loadQueries();
  }

  clearFilters(): void {
    this.selectedUserId = null;
    this.selectedDays = 30;
    this.limit = 100;
    this.loadQueries();
  }

  getUserDisplayName(user: User): string {
    return user.name || user.email;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  truncateQuery(query: string, maxLength: number = 100): string {
    if (query.length <= maxLength) {
      return query;
    }
    return query.substring(0, maxLength) + '...';
  }

  refreshQueries(): void {
    this.loadQueries();
  }
}
