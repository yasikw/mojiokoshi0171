import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { marked } from 'marked';

export async function exportToPdf(content: string, title: string): Promise<void> {
  // マークダウンをHTMLに変換
  const htmlContent = marked(content);
  
  // 一時的なコンテナを作成
  const container = document.createElement('div');
  container.className = 'pdf-container prose prose-sm max-w-none p-8';
  container.innerHTML = htmlContent;
  container.style.width = '800px';
  document.body.appendChild(container);

  try {
    // HTML2Canvasでコンテンツをキャプチャ
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    // PDFを作成
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // キャンバスをPDFに追加
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // ヘッダーを追加
    pdf.setFontSize(16);
    pdf.text(title, 20, 20);
    pdf.setFontSize(10);
    const date = new Date().toLocaleDateString('ja-JP');
    pdf.text(`作成日: ${date}`, 20, 30);

    // コンテンツを追加
    pdf.addImage(imgData, 'PNG', 20, 40, pdfWidth - 40, pdfHeight - 40);

    // PDFを保存
    const fileName = `${title}_${date}.pdf`;
    pdf.save(fileName);
  } finally {
    // 一時的なコンテナを削除
    document.body.removeChild(container);
  }
}