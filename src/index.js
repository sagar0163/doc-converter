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
        return this.toHtml(input, inputFormat);
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
    if (typeof input !== 'string') {
      if (isDocxBuffer(input)) return 'docx';
      return 'binary';
    }
    if (input.trim().startsWith('#') || input.includes('```')) return 'markdown';
    if (input.trim().startsWith('<')) return 'html';
    return 'text';
  }

  async toHtml(input, format, options = {}) {
    switch (format) {
      case 'markdown':
        return convertMarkdownToHtml(input);
      case 'text':
        return input
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      case 'html':
        if (options.isInternalPdfRender) {
          return input;
        }
        throw new Error('Raw HTML passthrough is blocked for security reasons');
      default:
        throw new Error(`Unsupported conversion: ${format} -> html`);
    }
  }

  async toPdf(input, format, options) {
    const html = await this.toHtml(input, format, { isInternalPdfRender: true });
    return convertHtmlToPdf(html, options);
  }

  async toMarkdown(input, format, options) {
    switch (format) {
      case 'docx':
        return convertDocxToMarkdown(input, options);
      case 'markdown':
      case 'md':
        return input;
      default:
        throw new Error(`Unsupported conversion: ${format} -> markdown`);
    }
  }
}

function isDocxBuffer(input) {
  if (Buffer.isBuffer(input)) {
    return input.length > 4 && input.readUInt32LE(0) === 0x0403_4b50;
  }
  return false;
}

export default DocumentConverter;