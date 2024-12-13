import { marked } from 'marked';
import { PDF_CONFIG } from './config';

export function createPdfContainer(content: string): HTMLElement {
  const container = document.createElement('div');
  container.id = 'pdf-container';
  container.className = PDF_CONFIG.container.className;
  container.style.width = PDF_CONFIG.container.width;
  container.style.visibility = 'hidden';
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  
  // マークダウンをHTMLに変換
  const htmlContent = marked(content, {
    breaks: true,
    gfm: true
  });
  
  container.innerHTML = htmlContent;
  return container;
}

export function appendToBody(element: HTMLElement): void {
  document.body.appendChild(element);
}

export function removeFromBody(element: HTMLElement): void {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}