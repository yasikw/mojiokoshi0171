import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Loader2, Info } from 'lucide-react';
import { askQuestion } from '../services/chatService';

interface ChatBotProps {
  transcript: string;
}

interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot' | 'system';
}

export const ChatBot: React.FC<ChatBotProps> = ({ transcript }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 初期メッセージを表示
    setMessages([
      {
        id: crypto.randomUUID(),
        content: '文字起こしの内容に関する質問にお答えします。具体的な質問を入力してください。',
        type: 'system'
      }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: input.trim(),
      type: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askQuestion(transcript, input.trim());
      const botMessage: Message = {
        id: crypto.randomUUID(),
        content: response,
        type: 'bot',
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: '申し訳ありません。エラーが発生しました。もう一度お試しください。',
        type: 'bot',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[400px] bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center">
          <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">Q&A チャット</h3>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Info className="w-4 h-4 mr-1" />
          <span>文字起こしの内容に基づいて回答します</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === 'user' 
                ? 'justify-end' 
                : message.type === 'system' 
                  ? 'justify-center' 
                  : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.type === 'system'
                  ? 'bg-gray-200 text-gray-600 text-sm'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="質問を入力してください..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};