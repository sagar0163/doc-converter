import MarkdownIt from 'markdown-it';
const md = new MarkdownIt({ html: true });
console.log(md.render('1 < 2 & <script>alert(1)</script> [x](javascript:alert(1))'));
