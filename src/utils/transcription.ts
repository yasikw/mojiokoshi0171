import { TranscriptionError } from './errors/TranscriptionError';
import { TranscriptionProgress } from '../types/transcription';
import { transcribeWithOpenAI } from '../services/openaiService';

const PROGRESS_STEPS = {
  INITIALIZING: { percentage: 0, status: 'initializing' as const },
  PROCESSING: { percentage: 30, status: 'processing' as const },
  COMPLETE: { percentage: 100, status: 'complete' as const },
  ERROR: { percentage: 0, status: 'error' as const }
};

export async function transcribeAudio(
  audioBlob: Blob,
  onProgress?: (progress: TranscriptionProgress) => void
): Promise<string> {
  if (!audioBlob) {
    throw new TranscriptionError('音声ファイルが選択されていません');
  }

  try {
    updateProgress(onProgress, PROGRESS_STEPS.INITIALIZING);
    
    updateProgress(onProgress, PROGRESS_STEPS.PROCESSING);
    const result = await transcribeWithOpenAI(audioBlob, {
      language: 'ja'
    });
    
    if (!result) {
      throw new TranscriptionError('文字起こし結果が空です');
    }

    updateProgress(onProgress, PROGRESS_STEPS.COMPLETE);
    return result.trim();
  } catch (error) {
    updateProgress(onProgress, PROGRESS_STEPS.ERROR);
    
    if (error instanceof TranscriptionError) {
      throw error;
    }
    
    console.error('文字起こしエラー:', error);
    throw new TranscriptionError(
      '文字起こし処理中にエラーが発生しました。もう一度お試しください。'
    );
  }
}

function updateProgress(
  onProgress: ((progress: TranscriptionProgress) => void) | undefined,
  { percentage, status }: TranscriptionProgress
): void {
  onProgress?.({ percentage, status });
}