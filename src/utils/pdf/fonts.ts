import { jsPDF } from 'jspdf';

// 日本語フォントの設定
export async function setupJapaneseFont(pdf: jsPDF): Promise<void> {
  try {
    // デフォルトフォントを設定
    pdf.setFont('Helvetica');
    
    // フォントサイズの設定
    pdf.setFontSize(10);
    
    // 文字エンコーディングの設定
    pdf.setLanguage('ja');
  } catch (error) {
    console.error('Font setup error:', error);
  }
}