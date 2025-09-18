export interface DocumentMetadata {
  sourceUrl?: string;
  trainerName?: string;
  mediaType?: string;
  provideLinkToSearcher: boolean;
}

export interface DocumentUpload {
  file: File;
  metadata: DocumentMetadata;
}
