import { Component, OnInit } from '@angular/core';
import { Transcript, TranscriptUpdateRequest } from '../../models/transcript.interface';
import { TranscriptService } from '../../services/transcript.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  transcripts: Transcript[] = [];
  filteredTranscripts: Transcript[] = [];
  isLoading = false;
  error: string | null = null;
  filterStatus: string = 'all';
  isUpdating: { [key: string]: boolean } = {};
  
  // Delete confirmation modal properties
  showDeleteModal = false;
  transcriptToDelete: Transcript | null = null;
  isDeleting = false;

  constructor(private transcriptService: TranscriptService) { }

  ngOnInit(): void {
    this.loadTranscripts();
  }

  loadTranscripts(): void {
    this.isLoading = true;
    this.error = null;

    this.transcriptService.getAllTranscripts().subscribe({
      next: (transcripts) => {
        this.transcripts = transcripts || [];
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading transcripts:', error);
        this.error = 'Failed to load documents. Please try again.';
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    switch (this.filterStatus) {
      case 'active':
        this.filteredTranscripts = this.transcripts.filter(t => t.active);
        break;
      case 'inactive':
        this.filteredTranscripts = this.transcripts.filter(t => !t.active);
        break;
      default:
        this.filteredTranscripts = [...this.transcripts];
    }
  }

  toggleActiveState(transcript: Transcript): void {
    this.isUpdating[transcript.id] = true;
    
    const updateRequest: TranscriptUpdateRequest = {
      id: transcript.id,
      active: !transcript.active
    };

    this.transcriptService.updateTranscriptActiveState(updateRequest).subscribe({
      next: (updatedTranscript) => {
        // Update the transcript in the array
        const index = this.transcripts.findIndex(t => t.id === transcript.id);
        if (index !== -1) {
          this.transcripts[index] = updatedTranscript;
        }
        this.applyFilter();
        this.isUpdating[transcript.id] = false;
      },
      error: (error) => {
        this.error = 'Failed to update document status. Please try again.';
        this.isUpdating[transcript.id] = false;
        console.error('Error updating transcript:', error);
      }
    });
  }

  getActiveCount(): number {
    return this.transcripts.filter(t => t.active).length;
  }

  getInactiveCount(): number {
    return this.transcripts.filter(t => !t.active).length;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Delete functionality
  confirmDelete(transcript: Transcript): void {
    this.transcriptToDelete = transcript;
    this.showDeleteModal = true;
  }

  onDeleteConfirmed(): void {
    if (!this.transcriptToDelete) return;

    this.isDeleting = true;
    this.transcriptService.deleteTranscript(this.transcriptToDelete.id).subscribe({
      next: () => {
        // Remove the transcript from the array
        this.transcripts = this.transcripts.filter(t => t.id !== this.transcriptToDelete!.id);
        this.applyFilter();
        this.isDeleting = false;
        this.showDeleteModal = false;
        this.transcriptToDelete = null;
      },
      error: (error) => {
        this.error = 'Failed to delete document. Please try again.';
        this.isDeleting = false;
        this.showDeleteModal = false;
        this.transcriptToDelete = null;
        console.error('Error deleting transcript:', error);
      }
    });
  }

  onDeleteCancelled(): void {
    this.showDeleteModal = false;
    this.transcriptToDelete = null;
    this.isDeleting = false;
  }

  getDeleteConfirmationMessage(): string {
    if (!this.transcriptToDelete) return '';
    const title = this.transcriptToDelete.title || 'Untitled Document';
    return `Are you sure you want to delete "${title}"? This action cannot be undone.`;
  }
}