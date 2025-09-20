export interface DocumentMetadata {
  sourceUrl?: string;
  trainerName?: string;
  fileTitle?: string;
  isVideo: boolean;
}

export interface DocumentUpload {
  file: File;
  metadata: DocumentMetadata;
}
