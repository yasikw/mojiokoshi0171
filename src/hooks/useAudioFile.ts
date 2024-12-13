import { useState, useCallback, useEffect } from 'react';
import { AudioProcessingError } from '../utils/errors/AudioError';
import { processAudioFile, createAudioUrl, revokeAudioUrl } from '../utils/audio/audioProcessor';

export const useAudioFile = () => {
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        revokeAudioUrl(audioUrl);
      }
    };
  }, [audioUrl]);

  const resetAudioFile = useCallback(() => {
    if (audioUrl) {
      revokeAudioUrl(audioUrl);
      setAudioUrl('');
    }
    setAudioBlob(null);
    setError(null);
  }, [audioUrl]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    resetAudioFile();
    setIsProcessing(true);
    setError(null);
    
    try {
      const processedBlob = await processAudioFile(file);
      const url = createAudioUrl(processedBlob);
      
      setAudioBlob(processedBlob);
      setAudioUrl(url);
    } catch (error) {
      if (error instanceof AudioProcessingError) {
        setError(error.message);
      } else {
        setError('ファイルの読み込みに失敗しました');
      }
      console.error('File processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [resetAudioFile]);

  return {
    audioUrl,
    audioBlob,
    error,
    isProcessing,
    handleFileUpload,
    resetAudioFile,
  };
};