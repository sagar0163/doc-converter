import MarkdownIt from 'markdown-it';
const md = new MarkdownIt({ html: false });
md.validateLink = function (url) {
  const str = url.trim().toLowerCase();
  if (/^(javascript|vbscript|data):/i.test(str)) return false;
  return true;
};
console.log(md.render('[x](javascript:alert(1))'));
console.log(md.render('![alt](data:image/png;base64,xx)'));
