import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config/api';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function askQuestion(context: string, question: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `以下の文字起こしの内容に基づいて質問に答えてください。

ガイドライン：
1. 文字起こしに明示的に含まれている情報のみを使用
2. 推測や解釈は避ける
3. 不明な情報は「その情報は文字起こしには含まれていません」と回答
4. 回答は簡潔かつ正確に
5. 文字起こしからの直接引用は『』で囲む`
        },
        {
          role: "user",
          content: `### 文字起こし ###\n${context}\n\n### 質問 ###\n${question}`
        }
      ],
      temperature: 0.0,
      max_tokens: 1000
    });

    const answer = response.choices[0]?.message?.content;
    if (!answer) {
      throw new Error('回答を生成できませんでした');
    }

    return answer;
  } catch (error) {
    console.error('Chat error:', error);
    throw new Error('申し訳ありませんが、回答の生成中にエラーが発生しました。もう一度お試しください。');
  }
}