import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Transcript, TranscriptUpdateRequest, TranscriptApiResponse } from '../models/transcript.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TranscriptService {
  private apiUrl = environment.apiUrl;

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

  deleteTranscript(transcriptId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/transcripts/${transcriptId}`);
  }
}