import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { setupJapaneseFont } from './fonts';
import { PDF_CONFIG } from './config';
import { PdfOptions } from './types';

export async function createPdf(options: PdfOptions): Promise<jsPDF> {
  const pdf = new jsPDF({
    orientation: options.orientation || 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  await setupJapaneseFont(pdf);
  return pdf;
}

export async function renderContent(
  element: HTMLElement,
  scale: number = 2
): Promise<HTMLCanvasElement> {
  return html2canvas(element, {
    scale,
    useCORS: true,
    logging: false,
    allowTaint: true,
    backgroundColor: '#ffffff'
  });
}

export function addHeaderToPdf(
  pdf: jsPDF,
  title: string,
  pageNumber: number,
  totalPages: number,
  date: string = new Date().toLocaleDateString('ja-JP')
): void {
  const margin = PDF_CONFIG.defaultMargins;
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // タイトル
  pdf.setFontSize(16);
  pdf.text(title, margin.left, margin.top);
  
  // 日付
  pdf.setFontSize(10);
  pdf.text(`作成日: ${date}`, margin.left, margin.top + 10);
  
  // ページ番号
  pdf.text(
    `${pageNumber}/${totalPages}`,
    pageWidth - margin.right - 20,
    pdf.internal.pageSize.getHeight() - margin.bottom
  );
}

export function addContentToPdf(
  pdf: jsPDF,
  canvas: HTMLCanvasElement,
  startY: number = 40
): { contentHeight: number; pageHeight: number } {
  const margin = PDF_CONFIG.defaultMargins;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - (margin.left + margin.right);
  
  const aspectRatio = canvas.height / canvas.width;
  const contentHeight = contentWidth * aspectRatio;
  
  pdf.addImage(
    canvas.toDataURL('image/jpeg', 0.95),
    'JPEG',
    margin.left,
    startY,
    contentWidth,
    contentHeight,
    undefined,
    'FAST'
  );

  return { contentHeight, pageHeight };
}