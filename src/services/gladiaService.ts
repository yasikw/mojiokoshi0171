import { GLADIA_API_KEY, GLADIA_API_URL } from '../config/api';
import { TranscriptionError } from '../utils/errors/TranscriptionError';
import { GladiaResponse, TranscriptionOptions } from '../types/transcription';
import { handleApiResponse } from '../utils/api';

export async function transcribeWithGladia(
  audioFile: Blob, 
  options: TranscriptionOptions = {}
): Promise<string> {
  if (!GLADIA_API_KEY) {
    throw new TranscriptionError('Gladia API キーが設定されていません');
  }

  try {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('toggle_diarization', options.diarization ? 'true' : 'false');
    formData.append('toggle_direct_translate', 'false');
    formData.append('target_translation_language', 'ja');
    formData.append('language', options.language || 'ja');
    formData.append('output_format', 'json');

    const response = await fetch(GLADIA_API_URL, {
      method: 'POST',
      headers: {
        'x-gladia-key': GLADIA_API_KEY,
        'Accept': 'application/json',
      },
      body: formData,
    });

    const data = await handleApiResponse(response);
    return extractTranscription(data);
  } catch (error) {
    console.error('Transcription API error:', error);
    if (error instanceof TranscriptionError) {
      throw error;
    }
    throw new TranscriptionError('文字起こし処理中にエラーが発生しました。もう一度お試しください。');
  }
}

function extractTranscription(data: GladiaResponse): string {
  if (!data) {
    throw new TranscriptionError('APIからの応答が空です');
  }

  if (data.error) {
    throw new TranscriptionError(`API エラー: ${data.error}`);
  }

  const transcription = data.result?.transcription || data.prediction;
  if (!transcription) {
    throw new TranscriptionError('文字起こし結果が空です。別の音声ファイルをお試しください。');
  }

  return transcription.trim();
}