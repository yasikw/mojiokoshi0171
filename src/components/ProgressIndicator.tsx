import React from 'react';
import { TranscriptionProgress } from '../types/transcription';

interface ProgressIndicatorProps {
  progress: TranscriptionProgress;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ progress }) => {
  const getStatusText = () => {
    switch (progress.status) {
      case 'initializing':
        return 'モデルを初期化中...';
      case 'processing':
        return '文字起こし処理中...';
      case 'complete':
        return '処理完了';
      case 'error':
        return 'エラーが発生しました';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{getStatusText()}</span>
        <span>{progress.percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
    </div>
  );
};