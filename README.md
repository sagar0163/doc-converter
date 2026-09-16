# DocConverter

A small Node.js document format converter for DevOps workflows. Converts
**Markdown → HTML**, **Markdown → PDF**, **HTML → PDF**, and **DOCX →
Markdown** via a CLI and a programmatic API.

## Features

- CLI tool: `doc-convert <input> [output] [--format html|pdf|md]`
- Programmatic API: `DocumentConverter` class
- Markdown → HTML conversion (headers, bold, italic, code, links, images, lists)
- Markdown → PDF and HTML → PDF via Puppeteer (system Chrome/Chromium)
- DOCX → Markdown via mammoth
- Output sanitization on by default: raw HTML is escaped, text nodes are
  entity-escaped, and `javascript:`/`data:`/`vbscript:` links are blocked
- Docker image that runs the CLI
- CI pipeline with lint, tests, and a security audit

## Not yet implemented (planned)

- Batch conversion of multiple files
- Formatting/style preservation

## Installation

```bash
npm install
npm link
```

PDF conversion requires a Chrome/Chromium binary. It is located
automatically on common paths, or pointed at explicitly with `CHROME_PATH`.

## Usage

```bash
# Convert a Markdown file to HTML
doc-convert input.md output.html

# Convert a Markdown file to PDF
doc-convert input.md output.pdf

# Convert an HTML file to PDF
doc-convert index.html output.pdf

# Convert a DOCX file to Markdown
doc-convert document.docx output.md

# Show help/version
doc-convert --help
doc-convert --version
```

Programmatic use:

```js
import { DocumentConverter } from 'doc-converter';

const converter = new DocumentConverter();
const html = await converter.convert('# Hello', 'html');
const pdf = await converter.convert('# Hello', 'pdf'); // Buffer
const md = await converter.convert(docxBuffer, 'markdown');
```

## Development

```bash
npm install
npm test       # run unit + integration tests (vitest)
npm run lint   # run eslint
```

## License

MIT