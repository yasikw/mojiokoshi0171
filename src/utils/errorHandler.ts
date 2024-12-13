export class TranscriptionError extends Error {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message);
    this.name = 'TranscriptionError';
  }
}

export function handleModelError(error: unknown): never {
  console.error('Model initialization error:', error);
  resetModelState();
  throw new TranscriptionError(
    '音声認識モデルの初期化に失敗しました。ページを更新して再度お試しください。',
    error
  );
}

export function handleTranscriptionError(error: unknown): never {
  console.error('Transcription error:', error);
  resetModelState();
  throw new TranscriptionError(
    '文字起こし処理中にエラーが発生しました。もう一度お試しください。',
    error
  );
}

export function handleAudioProcessingError(error: unknown): never {
  console.error('Audio processing error:', error);
  throw new TranscriptionError(
    '音声ファイルの処理に失敗しました。別のファイルをお試しください。',
    error
  );
}

function resetModelState(): void {
  // Reset any global state related to the model
  try {
    // Clear any cached resources
    caches.delete('transformers-cache');
  } catch (e) {
    console.error('Failed to clear cache:', e);
  }
}