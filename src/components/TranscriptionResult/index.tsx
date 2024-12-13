import React from 'react';
import { TranscriptionTabs } from './TranscriptionTabs';
import { TranscriptionContent } from './TranscriptionContent';
import { useTranscriptionTabs } from './hooks/useTranscriptionTabs';
import { ErrorDisplay } from '../common/ErrorDisplay';

interface TranscriptionResultProps {
  transcript: string;
}

export const TranscriptionResult: React.FC<TranscriptionResultProps> = ({ transcript }) => {
  const { activeTab, isLoading, error, handlers } = useTranscriptionTabs(transcript);

  return (
    <div className="space-y-4">
      <TranscriptionTabs
        activeTab={activeTab}
        isLoading={isLoading}
        onTabChange={handlers.setActiveTab}
        onGenerateSummary={handlers.handleGenerateSummary}
        onExtractTasks={handlers.handleExtractTasks}
        onGenerateMinutes={handlers.handleGenerateMinutes}
      />

      {error && <ErrorDisplay message={error} />}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <TranscriptionContent
          activeTab={activeTab}
          transcript={transcript}
          onToggleComplete={handlers.handleToggleComplete}
        />
      </div>
    </div>
  );
};