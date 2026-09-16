# Architecture Document

## Current System

DocConverter is a small Node.js (ESM) project: a CLI entry point plus a
programmatic `DocumentConverter` class that dispatches to converter modules.

```
┌──────────────────────────────────────────────────────────┐
│                     DocConverter                          │
├──────────────────────────────────────────────────────────┤
│   CLI (src/cli.js)                                       │
│   - arg parsing, file read/write                         │
│          │                                               │
│          ▼                                               │
│   DocumentConverter (src/index.js)                       │
│   - format detection, dispatch                           │
│          │                                               │
│          ▼                                               │
│   Converters (src/converters/)                           │
│   - markdown.js  : Markdown → HTML (regex-based)         │
│   - html-pdf.js  : HTML → PDF (placeholder/stub)         │
│   - docx.js      : DOCX → Markdown (placeholder/stub)    │
└──────────────────────────────────────────────────────────┘
```

## Components

### 1. CLI Interface (`src/cli.js`)
- Argument parsing (`doc-convert <input> [output]`, `--format`, `--help`, `--version`)
- File path reading and output writing
- No batch processing

### 2. DocumentConverter (`src/index.js`)
- `convert()` dispatch by output format
- `detectFormat()` - content-based input detection
- `toHtml()`, `toPdf()`, `toMarkdown()` methods

### 3. Converters (`src/converters/`)
- **markdown.js** - hand-written regex-based Markdown → HTML conversion
  (headers, bold, italic, code blocks, inline code, links, images, lists,
  paragraphs). Does **not** use markdown-it or any external MD library.
- **html-pdf.js** - HTML → PDF. **Planned**, currently a placeholder that
  returns an options/message object. No puppeteer/pdfkit dependency currently.
- **docx.js** - DOCX → Markdown. **Planned**, currently a placeholder.
  No `docx`/`mammoth` library currently.

## Conversion Paths

```
Markdown ──► HTML   (implemented)
Markdown ──► PDF    (planned - placeholder only)
DOCX ──────► Markdown (planned - placeholder only)
```

## File Structure

```
doc-converter/
├── src/
│   ├── converters/
│   │   ├── markdown.js
│   │   ├── html-pdf.js
│   │   └── docx.js
│   ├── index.js        # DocumentConverter
│   └── cli.js
├── test/
│   └── unit/
├── .github/workflows/  # CI + release
├── .release-it.json
├── package.json
└── specs/
    ├── BRD.md
    └── ARCHITECTURE.md
```

There is no `formatters/` directory, no `src/cli/` directory, and no HTTP
server component.