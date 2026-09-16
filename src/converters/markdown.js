/**
 * Markdown to HTML converter.
 *
 * Input is treated as untrusted: the entire document is entity-escaped before
 * any markup is applied, so raw HTML is rendered as visible text and text
 * nodes are always well-formed. Link and image destinations are additionally
 * checked against script-bearing URL schemes (javascript:, data:, vbscript:)
 * before being re-escaped into their attributes. Sanitization is always on.
 */

import { escapeHtml, sanitizeUrl, unescapeHtml } from '../sanitize.js';

export function convertMarkdownToHtml(markdown) {
  let html = escapeHtml(markdown);

  // Convert headers
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  // Convert bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Convert italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Convert code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');

  // Convert inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Convert links (href is unescaped for scheme validation, then re-escaped)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, escapedSrc) => {
    const safeSrc = sanitizeUrl(unescapeHtml(escapedSrc));
    return `<img alt="${alt}" src="${escapeHtml(safeSrc)}">`;
  });
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, escapedHref) => {
    const safeHref = sanitizeUrl(unescapeHtml(escapedHref));
    return `<a href="${escapeHtml(safeHref)}">${text}</a>`;
  });

  // Convert lists
  html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Convert paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';

  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h[1-6]>)/g, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');

  return html;
}