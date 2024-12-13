import { SUPPORTED_AUDIO_FORMATS, MAX_FILE_SIZE, ERROR_MESSAGES } from './audioFormats';
import { AudioProcessingError } from '../errors/AudioError';

export function validateAudioFile(file: File): void {
  validateFileSize(file);
  validateFileType(file);
}

function validateFileSize(file: File): void {
  if (file.size > MAX_FILE_SIZE) {
    throw new AudioProcessingError(ERROR_MESSAGES.FILE_TOO_LARGE);
  }
}

function validateFileType(file: File): void {
  const fileType = file.type.toLowerCase();
  const extension = file.name.split('.').pop()?.toLowerCase();

  // MIMEタイプとファイル拡張子の両方をチェック
  const isSupported = Object.entries(SUPPORTED_AUDIO_FORMATS).some(([format, types]) => {
    const matchesMime = types.some(type => fileType === type || fileType.startsWith(type));
    const matchesExtension = extension === format;
    return matchesMime || matchesExtension;
  });

  if (!isSupported) {
    throw new AudioProcessingError(ERROR_MESSAGES.UNSUPPORTED_FORMAT);
  }
}