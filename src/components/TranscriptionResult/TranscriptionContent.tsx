import React from 'react';
import { Tab } from '../../types/transcription';
import { TabContent } from './TabContent';

interface TranscriptionContentProps {
  activeTab: Tab;
  transcript: string;
  onToggleComplete: (id: string) => void;
}

export const TranscriptionContent: React.FC<TranscriptionContentProps> = ({
  activeTab,
  transcript,
  onToggleComplete,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <TabContent
        activeTab={activeTab}
        transcript={transcript}
        onToggleComplete={onToggleComplete}
      />
    </div>
  );
};