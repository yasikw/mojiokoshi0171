import { useState, useCallback } from 'react';
import { transcribeAudio } from '../utils/transcription';
import { TranscriptionError } from '../utils/errors/TranscriptionError';
import { useAudioFile } from './useAudioFile';
import { useTranscriptionProgress } from './useTranscriptionProgress';
import { useTranscriptionState } from './useTranscriptionState';

export const useAudioTranscription = () => {
  const { 
    audioUrl, 
    audioBlob,
    error: fileError, 
    isProcessing,
    handleFileUpload, 
    resetAudioFile 
  } = useAudioFile();
  
  const { progress, updateProgress, resetProgress } = useTranscriptionProgress();
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(fileError);
  
  const { transcript, setTranscript, clearAll } = useTranscriptionState();

  const resetState = useCallback(() => {
    setError(null);
    resetProgress();
    setIsTranscribing(false);
  }, [resetProgress]);

  const resetAll = useCallback(() => {
    resetState();
    resetAudioFile();
    clearAll();
  }, [resetState, resetAudioFile, clearAll]);

  const handleNewFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    resetAll();
    handleFileUpload(event);
  }, [resetAll, handleFileUpload]);

  const startTranscription = useCallback(async () => {
    if (!audioBlob) {
      setError('音声ファイルを選択してください');
      return;
    }

    if (isTranscribing) {
      return;
    }

    setIsTranscribing(true);
    setError(null);
    
    try {
      const result = await transcribeAudio(audioBlob, updateProgress);
      if (result) {
        setTranscript(result);
      }
    } catch (error) {
      if (error instanceof TranscriptionError) {
        setError(error.message);
      } else {
        setError('文字起こし処理中にエラーが発生しました。もう一度お試しください。');
      }
      console.error('文字起こしエラー:', error);
    } finally {
      setIsTranscribing(false);
    }
  }, [audioBlob, isTranscribing, updateProgress, setTranscript]);

  return {
    audioUrl,
    transcript,
    isTranscribing,
    error: error || fileError,
    progress,
    isProcessing,
    handleFileUpload: handleNewFileUpload,
    startTranscription,
    resetAll,
  };
};