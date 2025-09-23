import { Component } from '@angular/core';
import { DocumentUploadService } from '../../services/document-upload.service';
import { DocumentMetadata, DocumentUpload } from '../../models/document-metadata.interface';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  selectedFiles: File[] = [];
  currentFileIndex: number = 0;
  isUploading: boolean = false;
  uploadComplete: boolean = false;
  uploadError: string = '';
  lastMetadata: DocumentMetadata | null = null; // Store last metadata for error recovery

  constructor(private documentUploadService: DocumentUploadService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
      this.currentFileIndex = 0;
      this.uploadComplete = false;
      this.uploadError = '';
      this.lastMetadata = null; // Clear any stored metadata for new upload
    }
  }

  getCurrentFile(): File | null {
    return this.selectedFiles[this.currentFileIndex] || null;
  }

  getCurrentFileName(): string {
    const file = this.getCurrentFile();
    return file ? file.name : '';
  }

  isLastFile(): boolean {
    return this.currentFileIndex === this.selectedFiles.length - 1;
  }

  onMetadataSubmitted(metadata: DocumentMetadata): void {
    const currentFile = this.getCurrentFile();
    if (!currentFile) return;

    this.isUploading = true;
    this.uploadError = '';
    // Store the metadata for potential error recovery
    this.lastMetadata = metadata;

    const documentUpload: DocumentUpload = {
      file: currentFile,
      metadata: metadata
    };

    this.documentUploadService.uploadDocument(documentUpload).then(response => {
      console.log('Upload successful:', response);
      this.lastMetadata = null; // Clear stored metadata on success
      this.moveToNextFile();
    }).catch(error => {
      console.error('Upload failed:', error);
      this.uploadError = 'Upload failed. Please try again.';
      this.isUploading = false;
      // Keep lastMetadata so form can be pre-filled on retry
    });
  }

  onSkipFile(): void {
    this.moveToNextFile();
  }

  private moveToNextFile(): void {
    this.isUploading = false;
    
    if (this.isLastFile()) {
      this.uploadComplete = true;
    } else {
      this.currentFileIndex++;
    }
  }

  resetUpload(): void {
    this.selectedFiles = [];
    this.currentFileIndex = 0;
    this.uploadComplete = false;
    this.uploadError = '';
    this.isUploading = false;
    this.lastMetadata = null; // Clear stored metadata on reset
  }
}
