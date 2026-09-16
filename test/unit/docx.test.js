import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { convertDocxToMarkdown } from '../../src/converters/docx.js';

const fixture = () => readFileSync(fileURLToPath(new URL('../fixtures/minimal.docx', import.meta.url)));

describe('DOCX to Markdown Converter', () => {
  it('extracts real markdown from a .docx buffer', async () => {
    const markdown = await convertDocxToMarkdown(fixture());
    expect(typeof markdown).toBe('string');
    expect(markdown).toContain('# Docx Fixture Title');
    expect(markdown).toContain('Hello from a');
    expect(markdown).toContain('bold');
    expect(markdown).not.toContain('{"message"');
  });

  it('accepts a base64 string as input', async () => {
    const markdown = await convertDocxToMarkdown(fixture().toString('base64'));
    expect(markdown).toContain('# Docx Fixture Title');
  });
});