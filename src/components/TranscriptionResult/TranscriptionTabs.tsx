import React from 'react';
import { Tab } from './types';
import { TabButton } from './TabButton';
import { FileText, AlignLeft, ListTodo, MessageSquare, FileCheck } from 'lucide-react';

interface TranscriptionTabsProps {
  activeTab: Tab;
  isLoading: boolean;
  onTabChange: (tab: Tab) => void;
  onGenerateSummary: () => void;
  onExtractTasks: () => void;
  onGenerateMinutes: () => void;
}

export const TranscriptionTabs: React.FC<TranscriptionTabsProps> = ({
  activeTab,
  isLoading,
  onTabChange,
  onGenerateSummary,
  onExtractTasks,
  onGenerateMinutes,
}) => (
  <div className="flex flex-wrap gap-2">
    <TabButton
      icon={FileText}
      label="文字起こし"
      isActive={activeTab === 'transcript'}
      onClick={() => onTabChange('transcript')}
    />
    <TabButton
      icon={AlignLeft}
      label="要約を生成"
      isActive={activeTab === 'summary'}
      isLoading={isLoading && activeTab === 'summary'}
      onClick={onGenerateSummary}
    />
    <TabButton
      icon={ListTodo}
      label="タスクを抽出"
      isActive={activeTab === 'todo'}
      isLoading={isLoading && activeTab === 'todo'}
      onClick={onExtractTasks}
    />
    <TabButton
      icon={MessageSquare}
      label="Q&A チャット"
      isActive={activeTab === 'chat'}
      onClick={() => onTabChange('chat')}
    />
    <TabButton
      icon={FileCheck}
      label="議事録を作成"
      isActive={activeTab === 'minutes'}
      isLoading={isLoading && activeTab === 'minutes'}
      onClick={onGenerateMinutes}
    />
  </div>
);