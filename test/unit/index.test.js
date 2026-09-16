import { describe, it, expect } from 'vitest';
import { DocumentConverter } from '../../src/index.js';

describe('DocumentConverter Security', () => {
  it('should throw an error for untrusted HTML passthrough', async () => {
    const converter = new DocumentConverter();
    // 'binary' is default format if input is not string, but let's pass a string that isn't markdown
    // like plain text or an HTML fragment if format isn't set.
    // We can explicitly call toHtml with format 'text'
    await expect(converter.toHtml('some text', 'text')).rejects.toThrow('Passthrough of untrusted input format text to HTML is not allowed');
  });

  it('should throw an error for untrusted Markdown passthrough', async () => {
    const converter = new DocumentConverter();
    await expect(converter.toMarkdown('some text', 'text')).rejects.toThrow('Passthrough of untrusted input format text to Markdown is not allowed');
  });

  it('should throw when converting text to html via convert method', async () => {
    const converter = new DocumentConverter();
    await expect(converter.convert('some text', 'html')).rejects.toThrow('Passthrough of untrusted input format text to HTML is not allowed');
  });
});
