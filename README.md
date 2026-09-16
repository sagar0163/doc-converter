# DocConverter

A small Node.js document format converter. Today it converts **Markdown to HTML**
with a CLI and a programmatic API. PDF and DOCX support are planned but not yet
implemented.

## Features

- CLI tool: `doc-convert <input> [output] [--format html|pdf|md]`
- Programmatic API: `DocumentConverter` class
- Markdown → HTML conversion (headers, bold, italic, code, links, images, lists)
- Docker image that runs the CLI
- CI pipeline with lint, tests, and a security audit

## Not yet implemented (planned)

- Batch conversion of multiple files
- Formatting/style preservation
- PDF generation (stub in `src/converters/html-pdf.js`)
- DOCX conversion (stub in `src/converters/docx.js`)

## Installation

```bash
npm install
npm link
```

## Usage

```bash
# Convert a Markdown file to HTML
doc-convert input.md output.html

# Convert to PDF (currently returns a placeholder object)
doc-convert input.md --format pdf

# Show help/version
doc-convert --help
doc-convert --version
```

Programmatic use:

```js
import { DocumentConverter } from 'doc-converter';

const converter = new DocumentConverter();
const html = await converter.convert('# Hello', 'html');
```

## Development

```bash
npm install
npm test       # run unit tests (vitest)
npm run lint   # run eslint
```

## License

MIT