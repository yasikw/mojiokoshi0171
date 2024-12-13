import OpenAI from 'openai';
import { OPENAI_API_KEY, validateApiKey } from '../config/api';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateMinutes(text: string): Promise<string> {
  if (!validateApiKey()) {
    throw new Error('OpenAI APIキーが正しく設定されていません。');
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `文字起こしから議事録を作成してください。以下の形式でマークダウン形式で出力してください：

# 議事録

## 会議概要
- 日時：[会議の日時]
- 参加者：[参加者リスト]
- 場所：[会議の場所]

## 議題
1. [議題1]
2. [議題2]
...

## 議事内容
### [議題1]
- [内容]
- [決定事項]
...

### [議題2]
...

## 決定事項
- [決定事項1]
- [決定事項2]
...

## 次回アクション
- [アクション1]
- [アクション2]
...

ガイドライン：
1. 文字起こしの内容から明確に読み取れる情報のみを使用
2. 不明な項目は「記載なし」と表示
3. 日時は具体的な記載があれば記入、なければ「記載なし」
4. 決定事項は明確に合意された内容のみを記載`
        },
        {
          role: "user",
          content: `以下の文字起こしから議事録を作成してください：\n${text}`
        }
      ],
      temperature: 0.0,
      max_tokens: 2000
    });

    const minutes = response.choices[0]?.message?.content;
    if (!minutes) {
      throw new Error('議事録の生成に失敗しました');
    }

    return minutes;
  } catch (error) {
    console.error('Minutes generation error:', error);
    throw new Error('議事録の生成中にエラーが発生しました。もう一度お試しください。');
  }
}