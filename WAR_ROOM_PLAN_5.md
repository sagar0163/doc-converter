# War Room Issue #5 — Docs truth pass

Task: align docs with code, remove junk, fix version drift and release churn.

## Checklist

- [ ] Remove 16 root junk files (a2.txt, c3.txt, docs.txt, f2.txt, i2.txt, l2.txt, o3.txt, v1/v2/v3_*.txt, x, x1.txt, z1.txt) and add .gitignore guard against root scratch files
- [ ] ci.yml: add scratch-file guard step + `npm audit --omit=dev` security step (backs SECURITY.md claim)
- [ ] Rewrite README.md to only list real features with truthful usage examples
- [ ] Rewrite API.md to document the real `DocumentConverter` API; drop fictional HTTP server/PORT/docker-run-p3000
- [ ] Update specs/ARCHITECTURE.md + specs/BRD.md: replace fictional engines (markdown-it/pdfkit/docx/puppeteer), mark PDF/DOCX as planned
- [ ] Align versions: CHANGELOG v1.0.0 -> 0.1.0, SECURITY.md 1.x -> 0.1.x (package.json already 0.1.0)
- [ ] release.yml: stop autotagging every push — trigger only on release branches / manual dispatch, no forced --patch bump
- [ ] Fix broken tests (markdown.test.js wrong import path; html-pdf.test.js imports non-existent html.js/pdf.js) so `npm test` passes
- [ ] Fix lint: add eslint + @eslint/js (config exists but package missing); add chalk as real prod dependency (cli.js imports it, Dockerfile uses --production)
- [ ] Run `npm test` + `npm run lint`, verify green
- [ ] Delete this plan file, final commit, push branch