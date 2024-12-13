import { useState, useCallback } from 'react';
import { TranscriptionProgress } from '../types/transcription';

const initialProgress: TranscriptionProgress = {
  percentage: 0,
  status: 'initializing'
};

export const useTranscriptionProgress = () => {
  const [progress, setProgress] = useState<TranscriptionProgress>(initialProgress);

  const updateProgress = useCallback((newProgress: TranscriptionProgress) => {
    setProgress(newProgress);
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(initialProgress);
  }, []);

  return {
    progress,
    updateProgress,
    resetProgress,
  };
};