import { describe, it, expect } from 'vitest';
import { convertHtmlToPdf } from '../../src/converters/html-pdf.js';

describe('HTML to PDF Converter', () => {
  it('is a placeholder that reports PDF conversion requires puppeteer', async () => {
    const result = await convertHtmlToPdf('<h1>Hello</h1>');
    expect(result.message).toContain('PDF conversion requires puppeteer');
  });

  it('passes the html through in the result', async () => {
    const html = '<h1>Hello</h1>';
    const result = await convertHtmlToPdf(html);
    expect(result.html).toBe(html);
  });

  it('applies default options', async () => {
    const result = await convertHtmlToPdf('<h1>Hello</h1>');
    expect(result.options).toEqual({ format: 'A4', margin: '1cm', landscape: false });
  });

  it('honours provided options', async () => {
    const result = await convertHtmlToPdf('<h1>Hello</h1>', {
      format: 'Letter',
      margin: '2cm',
      landscape: true,
    });
    expect(result.options).toEqual({ format: 'Letter', margin: '2cm', landscape: true });
  });
});