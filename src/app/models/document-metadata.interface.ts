export interface DocumentMetadata {
  sourceUrl?: string;
  trainerName?: string;
  title?: string;
  isVideo: boolean;
}

export interface DocumentUpload {
  file: File;
  metadata: DocumentMetadata;
}
