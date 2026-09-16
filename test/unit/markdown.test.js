import { describe, it, expect } from 'vitest';
import { convertMarkdownToHtml } from '../../src/converters/markdown.js';

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

describe('Markdown Security', () => {
  it('should escape raw HTML', () => {
    const md = '<script>alert(1)</script>';
    const html = convertMarkdownToHtml(md);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('should filter javascript: URLs in links', () => {
    const md = '[click](javascript:alert(1))';
    const html = convertMarkdownToHtml(md);
    expect(html).not.toContain('javascript:alert');
    expect(html).toContain('href="about:blank"');
  });

  it('should filter javascript: URLs with spaces', () => {
    const md = '[click](  javascript:alert(1) )';
    const html = convertMarkdownToHtml(md);
    expect(html).not.toContain('javascript:alert');
    expect(html).toContain('href="about:blank"');
  });

  it('should escape text nodes like < and &', () => {
    const md = '1 < 2 & 3 > 1';
    const html = convertMarkdownToHtml(md);
    expect(html).not.toContain('< 2');
    expect(html).toContain('1 &lt; 2 &amp; 3 &gt; 1');
  });

  it('should filter data: URLs in images', () => {
    const md = '![img](data:image/svg+xml;base64,PHN2Zw)';
    const html = convertMarkdownToHtml(md);
    expect(html).not.toContain('data:image');
    expect(html).toContain('src="about:blank"');
  });
});

  it('should prevent img-onerror injection via alt attribute', () => {
    const md = '![img" onerror="alert(1)"](http://example.com)';
    const html = convertMarkdownToHtml(md);
    expect(html).toContain('alt="img&quot; onerror=&quot;alert(1)&quot;"');
    expect(html).toContain('&quot;');
  });
