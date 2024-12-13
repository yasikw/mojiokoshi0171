import React from 'react';
import { Tab } from '../../types/transcription';
import { TodoList } from '../TodoList';
import { ChatBot } from '../ChatBot';
import { ExportPdfButton } from '../ExportPdfButton';
import { marked } from 'marked';
import { useTranscriptionState } from '../../hooks/useTranscriptionState';

interface TabContentProps {
  activeTab: Tab;
  transcript: string;
  onToggleComplete: (id: string) => void;
}

export const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  transcript,
  onToggleComplete,
}) => {
  const { summary, todoItems, minutes } = useTranscriptionState();

  switch (activeTab) {
    case 'transcript':
      return (
        <div className="whitespace-pre-wrap font-mono text-sm">
          {transcript}
        </div>
      );
    case 'summary':
      return (
        <div className="whitespace-pre-wrap">
          {summary || '要約を生成してください'}
        </div>
      );
    case 'todo':
      return (
        <TodoList 
          tasks={todoItems} 
          onToggleComplete={onToggleComplete}
        />
      );
    case 'chat':
      return (
        <ChatBot transcript={transcript} />
      );
    case 'minutes':
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">議事録</h2>
            {minutes && (
              <ExportPdfButton
                content={minutes}
                title="議事録"
              />
            )}
          </div>
          <div className="prose prose-sm max-w-none">
            {minutes ? (
              <div dangerouslySetInnerHTML={{ __html: marked(minutes) }} />
            ) : (
              '議事録を生成してください'
            )}
          </div>
        </div>
      );
    default:
      return null;
  }
};