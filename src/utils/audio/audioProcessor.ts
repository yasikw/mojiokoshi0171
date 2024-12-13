import { validateAudioFile } from './audioValidator';
import { convertAudioToWav } from './audioConverter';
import { compressAudioFile } from './audioCompressor';
import { AudioProcessingError } from '../errors/AudioError';
import { MAX_FILE_SIZE, ERROR_MESSAGES, SUPPORTED_AUDIO_FORMATS } from './audioFormats';

export async function processAudioFile(file: File): Promise<Blob> {
  try {
    validateAudioFile(file);

    // iOSデバイスの検出
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isM4A = fileExtension === 'm4a' || SUPPORTED_AUDIO_FORMATS.m4a.includes(file.type);
    const isMP3 = fileExtension === 'mp3' || SUPPORTED_AUDIO_FORMATS.mp3.includes(file.type);

    // ファイルを直接Blobとして読み込む
    const arrayBuffer = await file.arrayBuffer();
    const originalBlob = new Blob([arrayBuffer], { type: file.type });

    // iOSでの特別な処理
    if (isIOS) {
      // iOSではファイルをそのまま使用
      if (file.size > MAX_FILE_SIZE) {
        const compressed = await compressAudioFile(originalBlob);
        return new Blob([compressed], { type: file.type });
      }
      return originalBlob;
    }

    // 非iOSデバイスの処理
    let processedBlob = originalBlob;
    if (file.size > MAX_FILE_SIZE) {
      processedBlob = await compressAudioFile(originalBlob);
    }

    // WAVに変換（非iOSのみ）
    return await convertAudioToWav(new File([processedBlob], file.name, { type: file.type }));
  } catch (error) {
    if (error instanceof AudioProcessingError) {
      throw error;
    }
    console.error('音声処理エラー:', error);
    throw new AudioProcessingError(ERROR_MESSAGES.PROCESSING_ERROR, error);
  }
}

export function createAudioUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export function revokeAudioUrl(url: string): void {
  if (url) {
    URL.revokeObjectURL(url);
  }
}