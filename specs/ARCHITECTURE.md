# Architecture Document

## Current System

DocConverter is a small Node.js (ESM) project: a CLI entry point plus a
programmatic `DocumentConverter` class that dispatches to converter modules.

```
┌──────────────────────────────────────────────────────────┐
│                     DocConverter                          │
├──────────────────────────────────────────────────────────┤
│   CLI (src/cli.js)                                       │
│   - arg parsing, file read/write (binary-aware)          │
│          │                                               │
│          ▼                                               │
│   DocumentConverter (src/index.js)                       │
│   - format detection, dispatch, validation               │
│          │                                               │
│          ▼                                               │
│   Converters (src/converters/)                           │
│   - markdown.js  : Markdown → HTML (regex-based)         │
│   - html-pdf.js  : HTML → PDF (puppeteer-core)           │
│   - docx.js      : DOCX → Markdown (mammoth)             │
└──────────────────────────────────────────────────────────┘
```

## Components

### 1. CLI Interface (`src/cli.js`)
- Argument parsing (`doc-convert <input> [output]`, `--format`, `--help`, `--version`)
- Binary-aware file reading (`.docx` → Buffer, else UTF-8 string)
- Async writes; binary PDF buffers are written as bytes (never JSON-serialised)
- No batch processing

### 2. DocumentConverter (`src/index.js`)
- `convert()` dispatch by output format
- `detectFormat()` - content-based input detection (`markdown`, `html`, `text`,
  `docx` for ZIP-magic Buffers, `binary`)
- `toHtml()`, `toPdf()`, `toMarkdown()` methods
- Unsupported input/output pairs throw explicit errors

### 3. Converters (`src/converters/`)
- **markdown.js** - hand-written regex-based Markdown → HTML conversion
  (headers, bold, italic, code blocks, inline code, links, images, lists,
  paragraphs). Does **not** use markdown-it or any external MD library.
- **html-pdf.js** - HTML → PDF via `puppeteer-core`. Resolves a system
  Chrome/Chromium binary (`CHROME_PATH` env var, then common install paths).
  Honours `format`, `margin`, `landscape`, renders background. Returns a Buffer.
- **docx.js** - DOCX → Markdown via `mammoth.convertToMarkdown`. Accepts a
  Buffer or base64 string. Returns a Markdown string.

## Conversion Paths

```
Markdown ──► HTML   (implemented)
Markdown ──► PDF    (implemented - via HTML then puppeteer-core)
HTML ────────► PDF  (implemented - puppeteer-core)
DOCX ────────► Markdown (implemented - mammoth)
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
│   ├── unit/
│   ├── integration/
│   └── fixtures/minimal.docx
├── .github/workflows/  # CI + release
├── .release-it.json
├── package.json
└── specs/
    ├── BRD.md
    └── ARCHITECTURE.md
```

There is no `formatters/` directory, no `src/cli/` directory, and no HTTP
server component.