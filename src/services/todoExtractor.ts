import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config/api';
import { TodoItem, ExtractedSchedule } from '../types/todo';
import { detectPersons } from './personDetector';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function extractTodoItems(text: string): Promise<ExtractedSchedule> {
  try {
    const persons = await detectPersons(text);
    const currentDate = new Date();
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `文字起こしからタスクを抽出し、以下の形式でJSONを返してください：
{"tasks": [
  {
    "task": "タスクの内容",
    "assignee": "担当者名",
    "dueDate": "YYYY-MM-DD",
    "priority": "high/medium/low"
  }
]}

重要度の判定基準：
- high（最重要）：
  - 「緊急」「至急」「重要」「最優先」などの明示的な表現
  - 期限が1週間以内のタスク
  - 経営や売上に直接影響するタスク
  - クライアントや顧客に関わる重要な案件

- medium（重要）：
  - 「できるだけ早く」「なるべく早く」などの表現
  - 期限が2週間以内のタスク
  - 通常の業務フロー上で必要なタスク
  - 社内の重要度が中程度の案件

- low（通常）：
  - 期限に余裕があるタスク
  - 「時間があれば」「余裕があれば」などの表現
  - 改善提案や検討事項
  - 優先度が明示されていないルーチンワーク

ガイドライン：
1. 文字起こしに明示的に記載されているタスクのみを抽出
2. 担当者は ${JSON.stringify(persons)} のいずれかを指定（該当なしは「未定」）
3. 期日は ${currentDate.toISOString().split('T')[0]} を基準に計算
4. 重要度は上記の判定基準に従って厳密に判断
5. 文脈から重要度が判断できない場合はmediumを設定`
        },
        {
          role: "user",
          content: `以下の文字起こしからタスクを抽出してJSON形式で返してください：\n${text}`
        }
      ],
      temperature: 0.0,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('タスクの抽出に失敗しました');
    }

    const parsed = JSON.parse(content);
    return {
      tasks: parsed.tasks.map((task: any) => ({
        ...task,
        id: crypto.randomUUID(),
        completed: false
      }))
    };
  } catch (error) {
    console.error('Task extraction error:', error);
    return {
      tasks: [],
      error: 'タスクの抽出中にエラーが発生しました'
    };
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
  return `${date.getMonth() + 1}月${date.getDate()}日(${dayOfWeek})`;
}