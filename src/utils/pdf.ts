import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { marked } from 'marked';

export async function exportToPdf(content: string, title: string): Promise<void> {
  try {
    const container = createPdfContainer(content);
    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc, clonedElement) => {
          if (clonedElement) {
            clonedElement.style.width = '800px';
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

      // PDFのサイズを計算
      const margin = 20; // 余白（mm）
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const contentWidth = pageWidth - (margin * 2);

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
          pdf.text(title, margin, margin);
          pdf.setFontSize(10);
          pdf.text(`作成日: ${date}`, margin, margin + 8);
        }

        const pageContentHeight = Math.min(
          remainingHeight,
          pageHeight - (currentPage === 1 ? margin + headerHeight : margin * 2)
        );

        pdf.addImage(
          canvas,
          'JPEG',
          margin,
          currentPage === 1 ? margin + headerHeight : margin,
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

        // ページ番号を追加
        const totalPages = Math.ceil(scaledHeight / (pageHeight - margin * 2));
        pdf.setFontSize(10);
        pdf.text(
          `${currentPage - 1}/${totalPages}`,
          pageWidth - margin - 15,
          pageHeight - margin
        );
      }

      const fileName = `${title}_${date}.pdf`;
      pdf.save(fileName);
    } finally {
      document.body.removeChild(container);
    }
  } catch (error) {
    console.error('PDF export error:', error);
    throw new Error('PDFの出力中にエラーが発生しました。');
  }
}

function createPdfContainer(content: string): HTMLElement {
  const container = document.createElement('div');
  container.className = 'pdf-container prose prose-sm max-w-none p-8';
  container.style.width = '800px';
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.backgroundColor = '#ffffff';
  container.innerHTML = marked(content);
  return container;
}