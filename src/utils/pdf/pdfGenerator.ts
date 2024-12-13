import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PDF_CONFIG } from './config';
import { PdfOptions, PdfContent, PdfDimensions } from './types';

// Base64エンコードされた日本語フォントデータ
import { loadNotoSansJP } from './fonts';

export async function generatePdf(
  container: HTMLElement,
  options: PdfOptions
): Promise<jsPDF> {
  const canvas = await html2canvas(container, {
    ...PDF_CONFIG.canvas,
    onclone: (clonedDoc) => {
      const clonedElement = clonedDoc.getElementById('pdf-container');
      if (clonedElement) {
        clonedElement.style.width = PDF_CONFIG.container.width;
      }
    }
  });

  const pdf = createPdfDocument(options);
  const dimensions = calculateDimensions(canvas, pdf);
  
  // 日本語フォントの設定
  await setupJapaneseFont(pdf);
  
  addHeader(pdf, {
    title: options.title,
    content: container.innerHTML,
    date: new Date().toLocaleDateString('ja-JP')
  });
  
  addContent(pdf, canvas, dimensions);
  
  return pdf;
}

async function setupJapaneseFont(pdf: jsPDF): Promise<void> {
  try {
    const fontData = await loadNotoSansJP();
    pdf.addFileToVFS('NotoSansJP-Regular.ttf', fontData);
    pdf.addFont('NotoSansJP-Regular.ttf', 'NotoSansJP', 'normal');
    pdf.setFont('NotoSansJP');
  } catch (error) {
    console.error('Failed to load Japanese font:', error);
    // フォールバックフォントを使用
    pdf.setFont('Helvetica');
  }
}

function createPdfDocument(options: PdfOptions): jsPDF {
  return new jsPDF({
    orientation: options.orientation || PDF_CONFIG.defaultOrientation,
    unit: options.unit || PDF_CONFIG.defaultUnit,
    format: options.format || PDF_CONFIG.defaultFormat,
    putOnlyUsedFonts: true,
    compress: true,
    hotfixes: ['px_scaling']
  });
}

function calculateDimensions(canvas: HTMLCanvasElement, pdf: jsPDF): PdfDimensions {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = PDF_CONFIG.defaultMargins;
  
  const availableWidth = pageWidth - (margin.left + margin.right);
  const scaleFactor = availableWidth / canvas.width;
  const scaledHeight = canvas.height * scaleFactor;
  
  return {
    width: availableWidth,
    height: Math.min(scaledHeight, pageHeight - (margin.top + margin.bottom))
  };
}

function addHeader(pdf: jsPDF, content: PdfContent): void {
  const { fonts, defaultMargins } = PDF_CONFIG;
  
  pdf.setFontSize(fonts.header.size);
  pdf.text(content.title, defaultMargins.left, defaultMargins.top);
  
  pdf.setFontSize(fonts.subheader.size);
  const date = `作成日: ${content.date}`;
  pdf.text(date, defaultMargins.left, defaultMargins.top + 10);
}

function addContent(
  pdf: jsPDF,
  canvas: HTMLCanvasElement,
  dimensions: PdfDimensions
): void {
  const { defaultMargins } = PDF_CONFIG;
  
  try {
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(
      imgData,
      'JPEG',
      defaultMargins.left,
      defaultMargins.top + 20,
      dimensions.width,
      dimensions.height,
      undefined,
      'FAST'
    );
  } catch (error) {
    console.error('Failed to add image to PDF:', error);
    pdf.setFontSize(12);
    pdf.text('コンテンツの読み込みに失敗しました。', defaultMargins.left, defaultMargins.top + 30);
  }
}