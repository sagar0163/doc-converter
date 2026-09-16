/**
 * Markdown to HTML converter
 */
import MarkdownIt from 'markdown-it';

export function convertMarkdownToHtml(markdown) {
  const md = new MarkdownIt({
    html: true,
  });
  
  // The old code wrapped code blocks incorrectly, let's just return what MarkdownIt provides.
  // MarkdownIt handles everything efficiently.
  return md.render(markdown);
}
