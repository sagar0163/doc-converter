# WAR ROOM PLAN — Issue #1: Fix broken dev/runtime toolchain

Branch: `war-room-issue-1` (PR target: `main`). Do NOT switch branches.

## Subtasks

- [x] Declare missing deps in package.json: `chalk` (dependencies); `vitest`, `eslint`, `@eslint/js`, `prettier` (devDependencies). Regenerate package-lock.json.
- [x] Verify clean install: `npm ci` succeeds.
- [x] Fix `test/unit/html-pdf.test.js`: import real `html-pdf.js` module (`convertHtmlToPdf`); remove/replace the two tautological `expect(true).toBe(true)` mock tests with real assertions. Also fixed wrong `../src` relative imports in both test files (`../../src`).
- [x] Verify CLI: `node src/cli.js --help` and `--version` work (no module-not-found).
- [x] Verify `npm test` passes.
- [x] Verify `npm run lint` passes.
- [ ] Verify Docker: `docker build -t doc-converter . && docker run doc-converter --help` prints help.
- [ ] Delete plan file, final commit referencing #1, push branch.