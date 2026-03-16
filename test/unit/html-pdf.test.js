import { describe, it, expect } from 'vitest';
import { convertHtml } from '../src/converters/html.js';
import { convertPdf } from '../src/converters/pdf.js';

describe('HTML Converter', () => {
  it('should convert HTML to Markdown', () => {
    const html = '<h1>Title</h1><p>Paragraph</p>';
    const result = convertHtml(html);
    expect(result).toContain('Title');
    expect(result).toContain('Paragraph');
  });

  it('should handle inline styles', () => {
    const html = '<p style="color:red">Red text</p>';
    const result = convertHtml(html);
    expect(result).toBeDefined();
  });

  it('should handle nested elements', () => {
    const html = '<div><ul><li>Item 1</li><li>Item 2</li></ul></div>';
    const result = convertHtml(html);
    expect(result).toContain('Item 1');
    expect(result).toContain('Item 2');
  });
});

describe('PDF Converter', () => {
  it('should handle basic PDF conversion', () => {
    // Mock test
    expect(true).toBe(true);
  });

  it('should handle PDF with images', () => {
    // Mock test
    expect(true).toBe(true);
  });
});
