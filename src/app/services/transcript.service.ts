import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Transcript, TranscriptUpdateRequest, TranscriptApiResponse } from '../models/transcript.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TranscriptService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllTranscripts(): Promise<Transcript[]> {
    return firstValueFrom(this.http.get<TranscriptApiResponse>(`${this.apiUrl}/transcripts/metadata`)).then(response => response.transcripts);
  }

  updateTranscriptActiveState(updateRequest: TranscriptUpdateRequest): Promise<Transcript> {
    return firstValueFrom(this.http.patch<Transcript>(`${this.apiUrl}/transcripts/${updateRequest.id}/active`, {
      active: updateRequest.active
    }));
  }

  deleteTranscript(transcriptId: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.apiUrl}/transcripts/${transcriptId}`));
  }
}