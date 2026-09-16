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

Converts `input` to the requested output format. Returns a string for HTML output
and an object for the (placeholder) PDF/DOCX paths.

- `input` - string content or buffer
- `outputFormat` - `'html'`, `'pdf'`, `'markdown'`/`'md'`
- `options` - optional per-call options

```js
const result = await converter.convert('# Hello', 'html');
// result: '<h1>Hello</h1>'

throw new Error(`Unsupported output format: ${outputFormat}`); // for others
```

### `detectFormat(input)`

Detects a format from content: `'markdown'`, `'html'`, `'text'`, or `'binary'`.

### `toHtml(input, format, options?)`

Converts Markdown input to HTML (delegates to `convertMarkdownToHtml`). Other
input formats are passed through unchanged.

### `toPdf(input, format, options?)`

Converts to HTML first, then delegates to `convertHtmlToPdf`. Currently a
placeholder — PDF generation is planned, not implemented.

### `toMarkdown(input, format, options?)`

Converts DOCX input to Markdown via `convertDocxToMarkdown`. Currently a
placeholder — DOCX conversion is planned, not implemented.

## Supported Formats

| Input              | Output        | Status                       |
| ------------------ | ------------- | ---------------------------- |
| Markdown           | HTML          | Implemented                  |
| Markdown           | PDF           | Planned (placeholder result) |
| DOCX               | Markdown      | Planned (placeholder result) |
| HTML               | Markdown      | Not supported                |
| PDF                | Markdown, HTML| Not supported                |

## CLI Usage

```bash
# Convert Markdown to HTML
doc-convert input.md output.html

# Convert to a format via --format
doc-convert input.md --format pdf

# Show help / version
doc-convert --help
doc-convert --version
```

The CLI reads the input file as UTF-8 and, when `output` is given, writes the
result to that file. See `src/cli.js`.

## Environment Variables

None. The package is a CLI + library, not a server; there is no `PORT` or HTTP
endpoint, and `docker run -p 3000:3000` is not applicable.

## Docker

```bash
docker build -t doc-converter .
docker run doc-converter --help
docker run doc-converter -v "$PWD":/app/documents --help
```

The image runs the `doc-convert` CLI (see `Dockerfile`). It does not serve HTTP.