# DocumentConverter - API Reference

This package exposes two interfaces: a **programmatic API** (the `DocumentConverter`
class) and a **CLI** (`doc-convert`). There is no HTTP server.

## Programmatic API

```js
import { DocumentConverter } from 'doc-converter';
// or: import DocumentConverter from 'doc-converter' (default export)

const converter = new DocumentConverter(options);
```

### `new DocumentConverter(options?)`

Creates a converter instance. `options` is an optional object stored on the
instance and passed through to converter functions.

### `convert(input, outputFormat, options?)`

Converts `input` to the requested output format. Returns a string for HTML and
Markdown output and a `Buffer` for PDF output.

- `input` - string content or Buffer (pass a `Buffer` for DOCX input)
- `outputFormat` - `'html'`, `'pdf'`, `'markdown'`/`'md'`
- `options` - optional per-call options

```js
const result = await converter.convert('# Hello', 'html');
// result: '<h1>Hello</h1>'

const pdf = await converter.convert('# Hello', 'pdf');
// pdf: Buffer starting with '%PDF-'

const md = await converter.convert(docxBuffer, 'markdown');
// md: markdown text extracted from the .docx
```

Unsupported format pairs throw an explicit error. For example:

```js
throw new Error(`Unsupported conversion: docx -> html`);
throw new Error(`Unsupported output format: docx`);
```

### `detectFormat(input)`

Detects a format from content: `'markdown'`, `'html'`, `'text'`, `'docx'`
(a Buffer with a ZIP/`PK` magic header), or `'binary'`.

### `toHtml(input, format, options?)`

Converts Markdown input to HTML (delegates to `convertMarkdownToHtml`). HTML and
text input are passed through unchanged. Anything else throws.

### `toPdf(input, format, options?)`

Converts to HTML first, then delegates to `convertHtmlToPdf` (Puppeteer).
Returns a `Buffer` containing a real PDF. Options: `format` (default `'A4'`),
`margin` (string or `{top,right,bottom,left}` object), `landscape` (boolean).
Requires a Chrome/Chromium binary (auto-detected or set via `CHROME_PATH`).

### `toMarkdown(input, format, options?)`

Converts DOCX input (a `Buffer`) to Markdown via `convertDocxToMarkdown`
(mammoth). Markdown input is passed through unchanged. Anything else throws.

## Supported Formats

| Input              | Output        | Status                  |
| ------------------ | ------------- | ----------------------- |
| Markdown           | HTML          | Implemented             |
| Markdown           | PDF           | Implemented (puppeteer) |
| HTML               | PDF           | Implemented (puppeteer) |
| DOCX               | Markdown      | Implemented (mammoth)   |
| PDF                | anything      | Not supported           |
| DOCX               | HTML/PDF      | Not supported           |

## CLI Usage

```bash
# Convert Markdown to HTML
doc-convert input.md output.html

# Convert Markdown or HTML to PDF
doc-convert input.md output.pdf

# Convert DOCX to Markdown
doc-convert document.docx output.md

# Choose the output format explicitly
doc-convert input.md --format pdf

# Show help / version
doc-convert --help
doc-convert --version
```

The CLI reads the input file as UTF-8 (or as binary when the input is a `.docx`)
and, when `output` is given, writes the result to that file. Binary PDF results
are written as bytes, never JSON-serialised. See `src/cli.js`.

## Environment Variables

| Variable     | Purpose                                   |
| ------------ | ----------------------------------------- |
| `CHROME_PATH`| Path to a Chrome/Chromium binary for PDF  |

## Docker

```bash
docker build -t doc-converter .
docker run doc-converter --help
docker run doc-converter -v "$PWD":/app/documents --help
```

The image runs the `doc-convert` CLI (see `Dockerfile`) and ships a Chromium
binary so PDF conversion works in the container. It does not serve HTTP.