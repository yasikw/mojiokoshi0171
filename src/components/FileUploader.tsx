import React, { useCallback, useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { SUPPORTED_AUDIO_FORMATS, MAX_FILE_SIZE } from '../utils/audio/audioFormats';

interface FileUploaderProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isProcessing?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileUpload,
  isProcessing = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const event = {
        target: {
          files: files
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onFileUpload(event);
    }
  }, [onFileUpload]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFileUpload(e);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileUpload]);

  const maxSizeMB = Math.floor(MAX_FILE_SIZE / (1024 * 1024));

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
        isProcessing 
          ? 'border-gray-300 bg-gray-50' 
          : 'border-gray-300 hover:border-blue-500'
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".mp3,.m4a,audio/mpeg,audio/mp3,audio/mp4,audio/x-m4a"
        onChange={handleFileChange}
        className="hidden"
        id="audio-upload"
        disabled={isProcessing}
      />
      <label
        htmlFor="audio-upload"
        className={`cursor-pointer flex flex-col items-center space-y-2 ${
          isProcessing ? 'cursor-not-allowed' : ''
        }`}
      >
        {isProcessing ? (
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        ) : (
          <Upload className="w-12 h-12 text-gray-400" />
        )}
        <span className="text-gray-600">
          {isProcessing 
            ? '音声ファイルを処理中...'
            : '音声ファイルを選択またはドラッグ＆ドロップ'
          }
        </span>
        <div className="text-sm text-gray-400 space-y-1">
          <p>対応形式: MP3, M4A</p>
          <p>最大サイズ: {maxSizeMB}MB</p>
        </div>
      </label>
    </div>
  );
};