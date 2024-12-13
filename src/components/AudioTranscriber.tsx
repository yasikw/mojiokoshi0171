import React from 'react';
import { FileUploader } from './FileUploader';
import { AudioPlayer } from './AudioPlayer';
import { TranscriptionResult } from './TranscriptionResult';
import { ProgressIndicator } from './ProgressIndicator';
import { useAudioTranscription } from '../hooks/useAudioTranscription';
import { RotateCcw } from 'lucide-react';

const AudioTranscriber: React.FC = () => {
  const {
    audioUrl,
    transcript,
    isTranscribing,
    error,
    progress,
    isProcessing,
    handleFileUpload,
    startTranscription,
    resetAll,
  } = useAudioTranscription();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">音声ファイルをアップロード</h2>
          {(audioUrl || transcript) && (
            <button
              onClick={resetAll}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              最初に戻る
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          <FileUploader 
            onFileUpload={handleFileUpload}
            isProcessing={isProcessing}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {audioUrl && (
            <>
              <AudioPlayer
                audioUrl={audioUrl}
                isTranscribing={isTranscribing}
                onStartTranscription={startTranscription}
              />
              {isTranscribing && <ProgressIndicator progress={progress} />}
            </>
          )}
        </div>
      </div>

      {transcript && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <TranscriptionResult transcript={transcript} />
        </div>
      )}
    </div>
  );
};

export default AudioTranscriber;