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

  it('should convert images without a stray !', () => {
    const md = '![alt text](https://example.com/image.png)';
    const html = convertMarkdownToHtml(md);
    expect(html).not.toContain('!<a href');
    expect(html).toContain('<img src="https://example.com/image.png" alt="alt text"');
  });

  it('should emit fenced code block contents verbatim', () => {
    const md = '```\n# not a header\n**not bold**\n```';
    const html = convertMarkdownToHtml(md);
    expect(html).not.toContain('<h1>');
    expect(html).not.toContain('<strong>');
    expect(html).toContain('# not a header');
    expect(html).toContain('**not bold**');
  });

  it('should handle nested emphasis correctly', () => {
    const md = '**bold and *italic* together**';
    const html = convertMarkdownToHtml(md);
    expect(html).toContain('<strong>bold and <em>italic</em> together</strong>');
  });

  it('should handle inline escaping', () => {
    const md = '\\*not italic\\*';
    const html = convertMarkdownToHtml(md);
    expect(html).not.toContain('<em>');
    expect(html).toContain('*not italic*');
  });

  it('should escape entities like ampersands and less-than in text', () => {
    const md = '1 < 2 & 3 > 1';
    const html = convertMarkdownToHtml(md);
    expect(html).toContain('1 &lt; 2 &amp; 3 &gt; 1');
  });

  it('should handle special regex replacement strings without token collisions', () => {
    const md = 'Cost is $$ and $& and $\'';
    const html = convertMarkdownToHtml(md);
    expect(html).toContain('Cost is $$ and $&amp; and $\''); // markdown-it will escape & to &amp;
  });

  it('should handle empty input', () => {
    const md = '';
    const html = convertMarkdownToHtml(md);
    expect(html.trim()).toBe('');
  });

  it('should handle malformed links', () => {
    const md = '[broken link(http://example.com)';
    const html = convertMarkdownToHtml(md);
    expect(html).toContain('[broken link(http://example.com)');
  });
});
