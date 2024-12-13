import React from 'react';
import { Headphones, FileText, Loader2 } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  isTranscribing: boolean;
  onStartTranscription: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  isTranscribing,
  onStartTranscription,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
        <Headphones className="w-6 h-6 text-gray-600 mr-2" />
        <audio src={audioUrl} controls className="w-full" />
      </div>

      <button
        onClick={onStartTranscription}
        disabled={isTranscribing}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center space-x-2"
      >
        {isTranscribing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>文字起こし中...</span>
          </>
        ) : (
          <>
            <FileText className="w-5 h-5" />
            <span>文字起こしを開始</span>
          </>
        )}
      </button>
    </div>
  );
};