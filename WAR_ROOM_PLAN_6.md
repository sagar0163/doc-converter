# WAR ROOM PLAN — Issue #6: Sanitize markdown-to-HTML output

- [x] Create `src/sanitize.js` with `escapeHtml` + `sanitizeUrl` (blocks javascript:/data:/vbscript: incl. entity + control-char variants)
- [x] Rewrite `src/converters/markdown.js` to pre-escape text, escape raw HTML, and sanitize link/image URLs
- [x] Escaping on pass-through paths in `src/index.js` (`text -> html` escaped; unsupported pairs already throw)
- [x] Unit tests: script/img-onerror injection, javascript: URLs (incl. variant encodings), `<`/`&` text, entity round-tripping
- [ ] Update API.md / README / CHANGELOG to document sanitization-on-by-default
- [ ] Run `npm test` and `npm run lint`; fix failures
- [ ] Delete plan file; final commit referencing #6; push branch