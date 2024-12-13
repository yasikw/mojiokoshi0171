import React, { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { exportToPdf } from '../utils/pdf';

interface ExportPdfButtonProps {
  content: string;
  title?: string;
  isLoading?: boolean;
}

export const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({
  content,
  title = '議事録',
  isLoading: parentLoading = false,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const isLoading = parentLoading || isExporting;

  const handleExport = async () => {
    if (isLoading) return;
    
    setIsExporting(true);
    try {
      await exportToPdf(content, title);
    } catch (error) {
      console.error('PDF export error:', error);
      alert('PDFの出力中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isLoading}
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : (
        <FileDown className="w-4 h-4 mr-2" />
      )}
      PDFで出力
    </button>
  );
};