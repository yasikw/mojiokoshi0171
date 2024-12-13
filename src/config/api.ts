export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const validateApiKey = (): boolean => {
  if (!OPENAI_API_KEY) {
    console.error('OpenAI APIキーが設定されていません。');
    return false;
  }

  if (OPENAI_API_KEY === 'your-openai-api-key-here') {
    console.error('OpenAI APIキーが正しく設定されていません。');
    return false;
  }

  return true;
};