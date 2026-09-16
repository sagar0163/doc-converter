# WAR ROOM PLAN — Issue #3: Real PDF + DOCX backends

Decision: BUILD (puppeteer-core for HTML->PDF, mammoth for DOCX->Markdown).

## Checklist

- [ ] Install deps: `puppeteer-core` (no bundled Chromium download) + `mammoth`; verify node_modules present
- [ ] Generate a minimal real .docx test fixture (base64) for docx->md tests
- [ ] Implement `src/converters/html-pdf.js`: real PDF buffer, chrome executable resolution (CHROME_PATH + common paths), format/margin/landscape/pageSize/printBackground honored, sandbox-safe launch fallback, browser closed in finally
- [ ] Implement `src/converters/docx.js`: real markdown via `mammoth.convertToMarkdown`, accepts Buffer, optional style-map/options
- [ ] Update `src/index.js`: `detectFormat` recognizes docx buffers (PK zip magic); unsupported pairs throw explicit errors instead of returning input unchanged; add `convert`/`toMarkdown`/`toHtml` coverage for md->md and html->html passthrough needed by pdf path
- [ ] Update `src/cli.js`: read binary input for docx, keep utf-8 for text; async write (`fs/promises`) that writes Buffers directly — NO JSON.stringify of results
- [ ] Rewrite `test/unit/html-pdf.test.js` (real PDF buffer + options) and update `test/unit/markdown.test.js` if affected
- [ ] Add `test/unit/docx.test.js` using the docx fixture
- [ ] Add `test/unit/index.test.js`: md->html, md->pdf, html->pdf, docx->md, and unsupported-pair throws
- [ ] Add `test/integration/cli.test.js`: round-trips md->pdf, html->pdf, docx->md produce valid files (not JSON)
- [ ] Update docs: README.md, API.md, specs/BRD.md, specs/ARCHITECTURE.md, CHANGELOG.md, TODO.md (PDF/DOCX implemented)
- [ ] Update Dockerfile: install chromium + CHROME_PATH env so PDF works in image
- [ ] Run `npm run lint`, `npm test`, `npm audit --audit-level=high`; fix failures