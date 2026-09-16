import { describe, it, expect } from 'vitest';
import { convertHtmlToPdf } from '../../src/converters/html-pdf.js';

describe('HTML to PDF Converter', () => {
  it('should return pdf metadata for given html', async () => {
    const result = await convertHtmlToPdf('<h1>Title</h1>');
    expect(result.message).toContain('PDF conversion');
    expect(result.html).toBe('<h1>Title</h1>');
  });

  it('should apply default pdf options', async () => {
    const result = await convertHtmlToPdf('<p>text</p>');
    expect(result.options).toEqual({ format: 'A4', margin: '1cm', landscape: false });
  });

  it('should honor custom pdf options', async () => {
    const result = await convertHtmlToPdf('<p>text</p>', {
      format: 'Letter',
      margin: '2cm',
      landscape: true,
    });
    expect(result.options).toEqual({ format: 'Letter', margin: '2cm', landscape: true });
  });
});