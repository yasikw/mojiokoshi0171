import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { marked } from 'marked';
import { PDF_CONFIG } from './config';

export async function generatePdf(content: string, title: string): Promise<void> {
  try {
    const container = createPdfContainer(content);
    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(container, {
        scale: PDF_CONFIG.canvas.scale,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc, clonedElement) => {
          if (clonedElement) {
            clonedElement.style.width = PDF_CONFIG.container.width;
          }
        }
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
        putOnlyUsedFonts: true,
      });

      const margin = PDF_CONFIG.defaultMargins;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const contentWidth = pageWidth - (margin.left + margin.right);

      // スケール計算
      const scale = contentWidth / canvas.width;
      const scaledHeight = canvas.height * scale;

      // ヘッダー
      const date = new Date().toLocaleDateString('ja-JP');
      const headerHeight = 15;

      let currentPage = 1;
      let remainingHeight = scaledHeight;
      let sourceY = 0;

      while (remainingHeight > 0) {
        if (currentPage > 1) {
          pdf.addPage();
        }

        // ヘッダーを追加（各ページ）
        if (currentPage === 1) {
          pdf.setFontSize(16);
          pdf.text(title, margin.left, margin.top);
          pdf.setFontSize(10);
          pdf.text(`作成日: ${date}`, margin.left, margin.top + 8);
        }

        const pageContentHeight = Math.min(
          remainingHeight,
          pageHeight - (currentPage === 1 ? margin.top + headerHeight : margin.top * 2)
        );

        pdf.addImage(
          canvas.toDataURL(PDF_CONFIG.canvas.imageType, PDF_CONFIG.canvas.quality),
          PDF_CONFIG.canvas.imageType,
          margin.left,
          currentPage === 1 ? margin.top + headerHeight : margin.top,
          contentWidth,
          pageContentHeight,
          undefined,
          'FAST',
          0,
          sourceY / scale
        );

        remainingHeight -= pageContentHeight;
        sourceY += pageContentHeight / scale;
        currentPage++;
      }

      const fileName = `${title}_${date}.pdf`;
      pdf.save(fileName);
    } finally {
      document.body.removeChild(container);
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('PDFの生成中にエラーが発生しました。');
  }
}

function createPdfContainer(content: string): HTMLElement {
  const container = document.createElement('div');
  container.className = PDF_CONFIG.container.className;
  container.style.width = PDF_CONFIG.container.width;
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.backgroundColor = '#ffffff';
  container.style.padding = '20px';
  container.innerHTML = marked(content);
  return container;
}