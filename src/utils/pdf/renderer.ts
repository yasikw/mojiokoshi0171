import html2canvas from 'html2canvas';
import { PDF_CONFIG } from './config';

export async function renderToCanvas(
  element: HTMLElement,
  options = PDF_CONFIG.canvas
): Promise<HTMLCanvasElement> {
  try {
    return await html2canvas(element, {
      ...options,
      onclone: (clonedDoc, clonedElement) => {
        // クローン要素のスタイルを調整
        clonedElement.style.width = PDF_CONFIG.container.width;
        clonedElement.style.height = 'auto';
        clonedElement.style.position = 'relative';
        clonedElement.style.left = '0';
        clonedElement.style.top = '0';
      }
    });
  } catch (error) {
    console.error('Canvas rendering error:', error);
    throw new Error('PDFの生成に失敗しました。');
  }
}