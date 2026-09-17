import MarkdownIt from 'markdown-it';
const md = new MarkdownIt({ html: true });
const badUrl = 'javascript:alert(1)';
console.log(md.render(`[x](${badUrl})`));
