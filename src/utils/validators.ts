export const VALID_AUDIO_TYPES = ['audio/wav', 'audio/mpeg', 'audio/mp4', 'audio/x-m4a'];
export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export function validateAudioFile(file: Blob): void {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('ファイルサイズが大きすぎます（最大25MB）');
  }

  if (!VALID_AUDIO_TYPES.some(type => file.type.startsWith(type))) {
    throw new Error('対応していない音声形式です。WAV、MP3、M4A形式をご利用ください。');
  }
}