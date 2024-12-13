import OpenAI from 'openai';
import { OPENAI_API_KEY, validateApiKey } from '../config/api';
import { TranscriptionError } from '../utils/errors/TranscriptionError';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

/**
 * 音声データをテキストに変換する
 */
export async function transcribeWithOpenAI(
  audioFile: Blob,
  options: { language?: string } = {}
): Promise<string> {
  if (!validateApiKey()) {
    throw new TranscriptionError('OpenAI APIキーが正しく設定されていません。.envファイルを確認してください。');
  }

  try {
    const file = new File([audioFile], 'audio.wav', { type: audioFile.type });
    
    const response = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: options.language || 'ja',
      response_format: 'text'
    });

    if (!response) {
      throw new TranscriptionError('文字起こし結果が空です');
    }

    return response.trim();
  } catch (error: any) {
    console.error('文字起こしAPIエラー:', error);
    
    if (error.status === 401) {
      throw new TranscriptionError('APIキーが無効です。正しいAPIキーを設定してください。');
    }
    
    if (error.status === 400) {
      throw new TranscriptionError('音声ファイルの処理に失敗しました。別のファイルをお試しください。');
    }

    throw new TranscriptionError('文字起こし処理中にエラーが発生しました。もう一度お試しください。');
  }
}

/**
 * テキストの要約を生成する
 */
export async function generateSummary(text: string): Promise<string> {
  if (!validateApiKey()) {
    throw new Error('OpenAI APIキーが正しく設定されていません。');
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `文字起こしの内容を要約してください。以下の形式で出力してください：

1. [重要ポイント1]
2. [重要ポイント2]
3. [重要ポイント3]

※ 各ポイントは1-2文で簡潔に。
※ 文字起こしに明示的に含まれる情報のみを使用。`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    const summary = response.choices[0]?.message?.content;
    if (!summary) {
      throw new Error('要約の生成に失敗しました。');
    }

    return summary;
  } catch (error: any) {
    console.error('要約生成エラー:', error);
    throw new Error('要約の生成中にエラーが発生しました。もう一度お試しください。');
  }
}