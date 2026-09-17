/**
 * Markdown to HTML converter
 */
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({ html: false });

// Block dangerous URL schemes
const BAD_SCHEMES = /^(javascript|data|vbscript):/i;

md.validateLink = function (url) {
  const str = url.trim().toLowerCase();
  if (BAD_SCHEMES.test(str)) {
    return false;
  }
  return true;
};

export function convertMarkdownToHtml(markdown, _options = {}) {
  return md.render(markdown);
}
