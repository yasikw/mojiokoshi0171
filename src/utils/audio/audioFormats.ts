export const SUPPORTED_AUDIO_FORMATS = {
  mp3: ['audio/mpeg', 'audio/mp3'],
  m4a: ['audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/mpeg4-generic'],
} as const;

export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
export const COMPRESSED_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const CONVERSION_OPTIONS = {
  sampleRate: 22050, // 圧縮のためにサンプルレートを下げる
  channels: 1, // モノラルに変換
  bitDepth: 16,
} as const;

export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'ファイルサイズが大きすぎます（最大25MB）。より小さいファイルを使用するか、音声の長さを短くしてください。',
  UNSUPPORTED_FORMAT: '対応していない音声形式です。MP3またはM4A形式をご利用ください。',
  PROCESSING_ERROR: '音声ファイルの処理に失敗しました。別のファイルをお試しください。',
  CONVERSION_ERROR: '音声ファイルの変換に失敗しました。別のファイルをお試しください。',
} as const;