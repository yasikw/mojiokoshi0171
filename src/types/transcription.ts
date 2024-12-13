export interface TranscriberState {
  transcriber: any | null;
  isInitializing: boolean;
  initPromise: Promise<any> | null;
}

export interface TranscriptionOptions {
  language?: string;
  diarization?: boolean;
  languageDetection?: boolean;
  task?: string;
  chunkLengthS?: number;
  strideLengthS?: number;
  returnTimestamps?: boolean;
}

export interface TranscriptionProgress {
  percentage: number;
  status: 'initializing' | 'processing' | 'complete' | 'error';
}

export interface GladiaResponse {
  prediction?: string;
  error?: string;
  result?: {
    transcription: string;
    language?: string;
    confidence?: number;
  };
  audio_url?: string;
  status?: string;
  id?: string;
}

export type Tab = 'transcript' | 'summary' | 'todo' | 'chat' | 'minutes';