import { TranscriptionError } from './errors/TranscriptionError';
import { GladiaResponse } from '../types/transcription';

export async function handleApiResponse(response: Response): Promise<GladiaResponse> {
  if (!response.ok) {
    const errorData = await parseErrorResponse(response);
    throw new TranscriptionError(createErrorMessage(response.status, errorData));
  }

  try {
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new TranscriptionError('予期しないレスポース形式です');
    }

    const data: GladiaResponse = await response.json();
    validateApiResponse(data);
    return data;
  } catch (error) {
    if (error instanceof TranscriptionError) {
      throw error;
    }
    console.error('API response parsing error:', error);
    throw new TranscriptionError('サーバーからの応答の解析に失敗しました。しばらく待ってから再度お試しください。');
  }
}

async function parseErrorResponse(response: Response): Promise<any> {
  try {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    }
    return { error: await response.text() };
  } catch {
    return { error: response.statusText || 'Unknown error' };
  }
}

function createErrorMessage(status: number, data: any): string {
  const baseMessage = data.error || 'Unknown error';
  
  switch (status) {
    case 400:
      return `リクエストが不正です: ${baseMessage}`;
    case 401:
      return 'API認証に失敗しました。APIキーを確認してください。';
    case 403:
      return 'APIへのアクセスが拒否されました。APIキーの権限を確認してください。';
    case 413:
      return 'ファイルサイズが大きすぎます。25MB以下のファイルを使用してください。';
    case 415:
      return '対応していないファイル形式です。WAV、MP3、M4A形式をご利用ください。';
    case 429:
      return 'APIリクエストの制限に達しました。しばらく待ってから再度お試しください。';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'サーバーエラーが発生しました。しばらく待ってから再度お試しください。';
    default:
      return `エラーが発生しました (${status}): ${baseMessage}`;
  }
}

function validateApiResponse(data: GladiaResponse): void {
  if (!data) {
    throw new TranscriptionError('APIからの応答が空です');
  }

  if (data.error) {
    throw new TranscriptionError(`API エラー: ${data.error}`);
  }

  if (!data.result?.transcription && !data.prediction) {
    throw new TranscriptionError('文字起こし結果が取得できませんでした');
  }
}