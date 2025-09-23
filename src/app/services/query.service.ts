import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface QueryRequest {
  question: string;
}

export interface QueryResponse {
  answer: string;
  sources?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  submitQuery(query: QueryRequest): Promise<QueryResponse> {
    return firstValueFrom(this.http.post<QueryResponse>(`${this.apiUrl}/query`, query));
  }
}