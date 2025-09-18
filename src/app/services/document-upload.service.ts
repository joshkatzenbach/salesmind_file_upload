import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentUpload } from '../models/document-metadata.interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentUploadService {
  private apiUrl = 'http://localhost:8000/upload'; // Leave blank as requested

  constructor(private http: HttpClient) { }

  uploadDocument(documentUpload: DocumentUpload): Observable<any> {
    const formData = new FormData();
    formData.append('file', documentUpload.file);
    formData.append('metadata', JSON.stringify(documentUpload.metadata));

    const headers = new HttpHeaders();
    // Don't set Content-Type, let browser set it with boundary for FormData

    return this.http.post(this.apiUrl, formData, { headers });
  }
}
 