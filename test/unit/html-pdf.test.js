import { describe, it, expect } from 'vitest';
import { convertHtmlToPdf, resolveChromeExecutable } from '../../src/converters/html-pdf.js';

describe('resolveChromeExecutable', () => {
  it('returns a non-empty string or undefined when no chrome found', () => {
    const result = resolveChromeExecutable();
    expect(result === undefined || typeof result === 'string').toBe(true);
  });
});

describe('HTML to PDF Converter', () => {
  it('produces a real PDF buffer starting with %PDF', async () => {
    const pdf = await convertHtmlToPdf('<h1>Hello</h1><p>World</p>');
    expect(Buffer.isBuffer(pdf)).toBe(true);
    expect(pdf.length).toBeGreaterThan(0);
    expect(pdf.slice(0, 5).toString('ascii')).toBe('%PDF-');
  });

  it('honours format, margin and landscape options without error', async () => {
    const pdf = await convertHtmlToPdf('<h1>Test</h1>', {
      format: 'Letter',
      margin: '2cm',
      landscape: true,
    });
    expect(Buffer.isBuffer(pdf)).toBe(true);
    expect(pdf.slice(0, 5).toString('ascii')).toBe('%PDF-');
  });

  it('honours a margin object {top,right,bottom,left}', async () => {
    const pdf = await convertHtmlToPdf('<h1>Margin</h1>', {
      margin: { top: '1in', right: '0.5in', bottom: '1in', left: '0.5in' },
    });
    expect(Buffer.isBuffer(pdf)).toBe(true);
    expect(pdf.slice(0, 5).toString('ascii')).toBe('%PDF-');
  });
});