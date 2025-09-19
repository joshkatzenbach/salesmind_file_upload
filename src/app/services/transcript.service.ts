import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Transcript, TranscriptUpdateRequest, TranscriptApiResponse } from '../models/transcript.interface';

@Injectable({
  providedIn: 'root'
})
export class TranscriptService {
  private apiUrl = 'http://localhost:8000'; // Backend API base URL

  constructor(private http: HttpClient) { }

  getAllTranscripts(): Observable<Transcript[]> {
    return this.http.get<TranscriptApiResponse>(`${this.apiUrl}/transcripts/metadata`).pipe(
      map(response => response.transcripts)
    );
  }

  updateTranscriptActiveState(updateRequest: TranscriptUpdateRequest): Observable<Transcript> {
    return this.http.patch<Transcript>(`${this.apiUrl}/transcripts/${updateRequest.id}/active`, {
      active: updateRequest.active
    });
  }
}