import { marked } from 'marked';
import { generatePdf } from './generator';
import { PdfOptions } from './types';

export async function exportToPdf(content: string, title: string): Promise<void> {
  try {
    // マークダウンをHTMLに変換
    const htmlContent = marked(content, {
      breaks: true,
      gfm: true
    });

    // PDFの生成
    const pdf = await generatePdf(htmlContent, { title });

    // PDFの保存
    const fileName = `${title}_${new Date().toLocaleDateString('ja-JP')}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('PDF export error:', error);
    throw new Error('PDFの出力中にエラーが発生しました。');
  }
}