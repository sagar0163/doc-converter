import { describe, it, expect } from 'vitest';
import { convertMarkdownToHtml } from '../../src/converters/markdown.js';
import { unescapeHtml } from '../../src/sanitize.js';

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

  it('escapes raw HTML instead of emitting it verbatim', () => {
    const html = convertMarkdownToHtml('<script>alert(1)</script>');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it('escapes raw HTML inside otherwise-valid markdown', () => {
    const html = convertMarkdownToHtml('# Title\n\n<script>alert(1)</script>');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it('neutralizes img onerror attribute injection', () => {
    const html = convertMarkdownToHtml('![x" onerror="alert(1)](https://example.com/img.png)');
    expect(html).not.toContain('onerror="alert(1)"');
    expect(html).toContain('alt="x&quot; onerror=&quot;alert(1)"');
  });

  it('blocks javascript: URLs', () => {
    const html = convertMarkdownToHtml('[x](javascript:alert(1))');
    expect(html).not.toContain('javascript:');
    expect(html).toContain('href="#');
  });

  it('blocks data: and vbscript: URLs', () => {
    const data = convertMarkdownToHtml('![x](data:text/html;base64,PHNjcmlwdD4=)');
    const vb = convertMarkdownToHtml('[x](vbscript:msgbox(1))');
    expect(data).not.toContain('data:text/html');
    expect(data).toContain('src="#"');
    expect(vb).not.toContain('vbscript:');
    expect(vb).toContain('href="#"');
  });

  it('blocks uppercase and whitespace-obfuscated javascript: URLs', () => {
    const upper = convertMarkdownToHtml('[x](JaVaScRiPt:alert(1))');
    const spaced = convertMarkdownToHtml('[x](java\nscript:alert(1))');
    expect(upper).not.toContain('javascript:');
    expect(upper).toContain('href="#"');
    expect(spaced).not.toContain('javascript:');
    expect(spaced).toContain('href="#"');
  });

  it('blocks character-reference-obfuscated javascript: URLs', () => {
    const numeric = convertMarkdownToHtml('[x](jav&#x61;script:alert(1))');
    const named = convertMarkdownToHtml('[x](javascript&colon;alert(1))');
    expect(numeric).not.toContain('javascript:');
    expect(numeric).toContain('href="#"');
    expect(named).not.toContain('javascript:');
    expect(named).toContain('href="#"');
  });

  it('keeps safe URLs intact', () => {
    const html = convertMarkdownToHtml('[a](https://example.com/?a=1&b=2)');
    expect(html).toContain('href="https://example.com/?a=1&amp;b=2"');
  });

  it('escapes < and & in text nodes', () => {
    const html = convertMarkdownToHtml('1 < 2 and A & B');
    expect(html).not.toContain('1 < 2');
    expect(html).toContain('1 &lt; 2 and A &amp; B');
  });

  it('round-trips escaped entities back to the original text', () => {
    const md = '1 < 2 and A & B "quoted" \'single\'';
    const html = convertMarkdownToHtml(md);
    const text = html.replace(/<\/?p>/g, '');
    expect(unescapeHtml(text)).toContain(md);
  });
});
