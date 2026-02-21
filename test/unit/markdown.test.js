import { describe, it, expect } from 'vitest';
import { convertMarkdownToHtml } from '../src/converters/markdown.js';

describe('Markdown Converter', () => {
  it('should convert headers', () => {
    const md = '# Hello\n## World';
    const html = convertMarkdownToHtml(md);
    expect(html).toContain('<h1>Hello</h1>');
    expect(html).toContain('<h2>World</h2>');
  });

  it('should convert bold text', () => {
    const md = 'This is **bold** text';
    const html = convertMarkdownToHtml(md);
    expect(html).toContain('<strong>bold</strong>');
  });

  it('should convert italic text', () => {
    const md = 'This is *italic* text';
    const html = convertMarkdownToHtml(md);
    expect(html).toContain('<em>italic</em>');
  });

  it('should convert code blocks', () => {
    const md = '```js\nconst x = 1;\n```';
    const html = convertMarkdownToHtml(md);
    expect(html).toContain('<pre>');
    expect(html).toContain('<code');
  });

  it('should convert links', () => {
    const md = '[Google](https://google.com)';
    const html = convertMarkdownToHtml(md);
    expect(html).toContain('<a href="https://google.com">Google</a>');
  });

  it('should convert lists', () => {
    const md = '- Item 1\n- Item 2';
    const html = convertMarkdownToHtml(md);
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>Item 1</li>');
  });
});
