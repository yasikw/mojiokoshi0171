import { pipeline } from '@xenova/transformers';
import { TranscriberState } from '../types/transcription';
import { ModelInitializationError } from './errors/ModelError';
import { clearModelCache } from './cache';

let state: TranscriberState = {
  transcriber: null,
  isInitializing: false,
  initPromise: null,
};

export async function initializeTranscriber(
  onProgress?: (progress: number) => void
): Promise<any> {
  if (state.transcriber) return state.transcriber;
  if (state.initPromise) return state.initPromise;

  try {
    state.isInitializing = true;
    state.initPromise = pipeline(
      'automatic-speech-recognition',
      'Xenova/whisper-small',
      {
        quantized: true,
        revision: 'main',
        cache_dir: '/cache',
        progress_callback: handleProgressCallback(onProgress),
      }
    );

    state.transcriber = await state.initPromise;
    return state.transcriber;
  } catch (error) {
    await handleModelInitializationError(error);
  } finally {
    state.isInitializing = false;
    state.initPromise = null;
  }
}

function handleProgressCallback(onProgress?: (progress: number) => void) {
  return (progress: any) => {
    if (progress?.progress) {
      const percentage = Math.round(progress.progress * 100);
      onProgress?.(percentage);
    }
  };
}

async function handleModelInitializationError(error: unknown): Promise<never> {
  console.error('Model initialization error:', error);
  await clearModelCache();
  resetTranscriberState();
  throw new ModelInitializationError('音声認識モデルの初期化に失敗しました。ページを更新して再度お試しください。', error);
}

export function resetTranscriberState(): void {
  state = {
    transcriber: null,
    isInitializing: false,
    initPromise: null,
  };
}

export function getTranscriberState(): TranscriberState {
  return state;
}