import MarkdownIt from 'markdown-it';
const md = new MarkdownIt();
console.log(md.utils.escapeHtml('1 < 2 & "foo" \'bar\''));
