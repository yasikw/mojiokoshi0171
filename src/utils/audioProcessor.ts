import { validateAudioFile } from './validators';
import { AudioProcessingError } from './errors/AudioError';

export async function processAudioFile(audioUrl: string): Promise<Blob> {
  if (!audioUrl) {
    throw new AudioProcessingError('音声URLが指定されていません');
  }

  try {
    const response = await fetch(audioUrl);
    if (!response.ok) {
      throw new AudioProcessingError(`音声ファイルの取得に失敗しました: ${response.statusText}`);
    }

    const audioData = await response.blob();
    if (audioData.size === 0) {
      throw new AudioProcessingError('音声ファイルが空です');
    }

    validateAudioFile(audioData);
    return audioData;
  } catch (error) {
    if (error instanceof AudioProcessingError) {
      throw error;
    }
    throw new AudioProcessingError('音声ファイルの処理に失敗しました。別のファイルをお試しください。', error);
  }
}