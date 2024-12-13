import { useState, useCallback } from 'react';
import { Tab } from '../types';
import { useTranscriptionState } from '../../../hooks/useTranscriptionState';
import { generateSummary } from '../../../services/openaiService';
import { extractTodoItems } from '../../../services/todoExtractor';
import { generateMinutes } from '../../../services/minutesGenerator';

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
    
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateSummary(transcript);
      setSummary(result);
      handleTabChange('summary');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '要約の生成中にエラーが発生しました';
      setError(errorMessage);
      console.error('Summary generation error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [transcript, isLoading, setSummary, handleTabChange]);

  const handleExtractTasks = useCallback(async () => {
    if (isLoading || !transcript) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const result = await extractTodoItems(transcript);
      if (result.error) {
        setError(result.error);
      } else {
        setTodoItems(result.tasks);
        handleTabChange('todo');
      }
    } catch (error) {
      setError('タスクの抽出中にエラーが発生しました');
      console.error('Task extraction error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [transcript, isLoading, setTodoItems, handleTabChange]);

  const handleGenerateMinutes = useCallback(async () => {
    if (isLoading || !transcript) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateMinutes(transcript);
      setMinutes(result);
      handleTabChange('minutes');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '議事録の生成中にエラーが発生しました';
      setError(errorMessage);
      console.error('Minutes generation error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [transcript, isLoading, setMinutes, handleTabChange]);

  const handleToggleComplete = useCallback((id: string) => {
    const task = todoItems.find(item => item.id === id);
    if (task) {
      updateTodoItem(id, { completed: !task.completed });
    }
  }, [todoItems, updateTodoItem]);

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