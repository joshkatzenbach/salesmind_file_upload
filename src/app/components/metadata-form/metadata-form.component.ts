import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentMetadata } from '../../models/document-metadata.interface';

@Component({
  selector: 'app-metadata-form',
  templateUrl: './metadata-form.component.html',
  styleUrls: ['./metadata-form.component.css']
})
export class MetadataFormComponent {
  @Input() fileName: string = '';
  @Input() isLastFile: boolean = false;
  @Output() metadataSubmitted = new EventEmitter<DocumentMetadata>();
  @Output() skipFile = new EventEmitter<void>();

  metadataForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.metadataForm = this.fb.group({
      sourceUrl: [''],
      trainerName: [''],
      fileTitle: [''],
      isVideo: [false]
    });
  }

  onSubmit(): void {
    // Since all fields are optional, we can always submit
    this.metadataSubmitted.emit(this.metadataForm.value);
  }

  onSkip(): void {
    this.skipFile.emit();
  }
}
