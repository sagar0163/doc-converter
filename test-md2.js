import MarkdownIt from 'markdown-it';
const md = new MarkdownIt({ html: false });
console.log(md.render('1 < 2 & <script>alert(1)</script> [x](javascript:alert(1)) <img src="data:image/svg+xml;base64,...">'));
