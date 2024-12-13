export interface PdfOptions {
  title: string;
  orientation?: 'portrait' | 'landscape';
  format?: string;
  unit?: string;
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface PdfContent {
  title: string;
  content: string;
  date: string;
}

export interface PdfDimensions {
  width: number;
  height: number;
}