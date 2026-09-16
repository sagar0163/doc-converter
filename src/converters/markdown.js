/**
 * Markdown to HTML converter
 */

function sanitizeUrl(url) {
  let cleanUrl = url.replace(/[\x00-\x1F\x7F]+/g, '').trim();
  let decoded = cleanUrl;
  try {
    decoded = decodeURIComponent(cleanUrl);
  } catch (e) {}
  decoded = decoded.replace(/[\x00-\x1F\x7F]+/g, '').trim();

  if (/^(javascript|data|vbscript):/i.test(decoded)) {
    return 'about:blank';
  }
  return url;
}

export function convertMarkdownToHtml(markdown, _options = {}) {
  let html = markdown;
  
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Images first so they don't get matched as links
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
    return `<img alt="${alt}" src="${sanitizeUrl(url)}">`;
  });
  
  // Then links - note: we need to avoid matching the link regex inside already processed tags
  // Actually, since the regex is simple, the simplest fix is `(?<!!)` negative lookbehind, but not supported everywhere.
  // We can just use `([^!]?)` or similar if needed.
  // Wait, if images are processed first, they become `<img...>`, so the `[...]` is gone.
  // Thus links won't match `![...]` anymore.
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    return `<a href="${sanitizeUrl(url)}">${text}</a>`;
  });
  
  html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h[1-6]>)/g, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
  
  return html;
}
