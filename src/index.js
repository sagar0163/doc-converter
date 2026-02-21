import { convertMarkdownToHtml } from './converters/markdown.js';
import { convertHtmlToPdf } from './converters/html-pdf.js';
import { convertDocxToMarkdown } from './converters/docx.js';

export class DocumentConverter {
  constructor(options = {}) {
    this.options = options;
  }

  async convert(input, outputFormat, options = {}) {
    const inputFormat = this.detectFormat(input);
    
    switch (outputFormat) {
      case 'html':
        return this.toHtml(input, inputFormat, options);
      case 'pdf':
        return this.toPdf(input, inputFormat, options);
      case 'markdown':
      case 'md':
        return this.toMarkdown(input, inputFormat, options);
      default:
        throw new Error(`Unsupported output format: ${outputFormat}`);
    }
  }

  detectFormat(input) {
    if (typeof input !== 'string') return 'binary';
    if (input.trim().startsWith('#') || input.includes('```')) return 'markdown';
    if (input.trim().startsWith('<')) return 'html';
    return 'text';
  }

  async toHtml(input, format, options) {
    switch (format) {
      case 'markdown':
        return convertMarkdownToHtml(input, options);
      default:
        return input;
    }
  }

  async toPdf(input, format, options) {
    const html = await this.toHtml(input, format, options);
    return convertHtmlToPdf(html, options);
  }

  async toMarkdown(input, format, options) {
    switch (format) {
      case 'docx':
        return convertDocxToMarkdown(input, options);
      default:
        return input;
    }
  }
}

export default DocumentConverter;
