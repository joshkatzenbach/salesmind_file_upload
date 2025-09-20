import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  submitQuery(query: QueryRequest): Observable<QueryResponse> {
    return this.http.post<QueryResponse>(`${this.apiUrl}/query`, query);
  }
}