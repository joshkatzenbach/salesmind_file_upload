export interface Transcript {
  id: number;
  title: string | null;
  trainer_name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  source_url?: string;
  media_type?: string;
  provide_link_to_searcher?: boolean;
}

export interface TranscriptApiResponse {
  transcripts: Transcript[];
  count: number;
  status: string;
}

export interface TranscriptUpdateRequest {
  id: number;
  active: boolean;
}
