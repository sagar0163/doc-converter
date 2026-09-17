/**
 * Markdown to HTML converter
 */
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({ html: true });

export function convertMarkdownToHtml(markdown, _options = {}) {
  return md.render(markdown);
}
