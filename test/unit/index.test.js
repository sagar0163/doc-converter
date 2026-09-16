import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import DocumentConverter from '../../src/index.js';

const DOCX_FIXTURE = readFileSync(fileURLToPath(new URL('../fixtures/minimal.docx', import.meta.url)));

describe('DocumentConverter', () => {
  const converter = new DocumentConverter();

  it('detects markdown, html, text, docx and binary formats', () => {
    expect(converter.detectFormat('# Heading')).toBe('markdown');
    expect(converter.detectFormat('<h1>Hi</h1>')).toBe('html');
    expect(converter.detectFormat('plain text')).toBe('text');
    expect(converter.detectFormat(DOCX_FIXTURE)).toBe('docx');
    expect(converter.detectFormat(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7]))).toBe('binary');
  });

  it('converts markdown to html', async () => {
    const html = await converter.convert('# Hello', 'html');
    expect(html).toContain('<h1>Hello</h1>');
  });

  it('converts markdown to a real PDF buffer', async () => {
    const pdf = await converter.convert('# Hello\n\nWorld', 'pdf');
    expect(Buffer.isBuffer(pdf)).toBe(true);
    expect(pdf.slice(0, 5).toString('ascii')).toBe('%PDF-');
  });

  it('converts html directly to a real PDF buffer', async () => {
    const pdf = await converter.convert('<h1>Hi</h1>', 'pdf');
    expect(Buffer.isBuffer(pdf)).toBe(true);
    expect(pdf.slice(0, 5).toString('ascii')).toBe('%PDF-');
  });

  it('converts a docx buffer to markdown', async () => {
    const md = await converter.convert(DOCX_FIXTURE, 'markdown');
    expect(md).toContain('# Docx Fixture Title');
    expect(md).not.toContain('{"message"');
  });

  it('throws an explicit error for unsupported docx -> html', async () => {
    await expect(converter.convert(DOCX_FIXTURE, 'html')).rejects.toThrow(
      'Unsupported conversion: docx -> html',
    );
  });

  it('throws an explicit error for unsupported html -> markdown', async () => {
    await expect(converter.convert('<h1>Hi</h1>', 'markdown')).rejects.toThrow(
      'Unsupported conversion: html -> markdown',
    );
  });

  it('throws an explicit error for unsupported output formats', async () => {
    await expect(converter.convert('# Hello', 'docx')).rejects.toThrow(
      'Unsupported output format: docx',
    );
  });
});