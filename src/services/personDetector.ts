import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config/api';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function detectPersons(text: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `文字起こしから人物を抽出してください。以下の形式でJSONを返してください：
{"persons": ["名前1", "名前2", ...]}

ガイドライン：
1. 文字起こしに明示的に登場する人物のみを抽出
2. 敬称は除外
3. 同一人物の呼び方は統一
4. 一般的な役職や曖昧な表現は除外
5. 重複を排除`
        },
        {
          role: "user",
          content: `以下の文字起こしから人物を抽出してJSON形式で返してください：\n${text}`
        }
      ],
      temperature: 0.0,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return [];
    }

    const parsed = JSON.parse(content);
    return Array.isArray(parsed.persons) ? parsed.persons : [];
  } catch (error) {
    console.error('Person detection error:', error);
    return [];
  }
}