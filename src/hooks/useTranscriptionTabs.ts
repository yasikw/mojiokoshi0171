import { useState, useCallback } from 'react';
import { Tab } from '../types/transcription';
import { useTranscriptionState } from './useTranscriptionState';
import { generateSummary } from '../services/openaiService';
import { extractTodoItems } from '../services/todoExtractor';
import { generateMinutes } from '../services/minutesGenerator';

export const useTranscriptionTabs = (transcript: string) => {
  const {
    summary,
    todoItems,
    minutes,
    activeTab,
    setSummary,
    setTodoItems,
    setMinutes,
    setActiveTab,
    updateTodoItem
  } = useTranscriptionState();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setError(null);
  }, [setActiveTab]);

  const handleGenerateSummary = useCallback(async () => {
    if (isLoading || !transcript) return;
    if (summary) {
      handleTabChange('summary');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateSummary(transcript);
      setSummary(result);
      handleTabChange('summary');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '要約の生成中にエラーが発生しました';
      setError(errorMessage);
      console.error('要約生成エラー:', error);
    } finally {
      setIsLoading(false);
    }
  }, [transcript, isLoading, summary, setSummary, handleTabChange]);

  // 他のハンドラーも同様に実装...

  return {
    activeTab,
    isLoading,
    error,
    handlers: {
      setActiveTab: handleTabChange,
      handleGenerateSummary,
      handleExtractTasks,
      handleGenerateMinutes,
      handleToggleComplete,
    },
  };
};