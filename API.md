# Document Converter - API Reference

## CLI Usage

```bash
# Convert Markdown to HTML
doc-converter input.md output.html

# Convert HTML to PDF
doc-converter input.html output.pdf

# Convert between formats
doc-converter input.md output.docx
```

## Supported Formats

| Input | Output |
|-------|--------|
| Markdown | HTML, PDF, DOCX |
| HTML | Markdown, PDF, DOCX |
| PDF | Markdown, HTML |
| DOCX | Markdown, HTML |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `NODE_ENV` | Environment (development/production) |

## API Endpoints

### POST /convert
Convert document between formats.

Request:
```json
{
  "input": "content",
  "from": "markdown",
  "to": "html"
}
```

Response:
```json
{
  "output": "converted content"
}
```

## Docker

```bash
docker build -t doc-converter .
docker run -p 3000:3000 doc-converter
```
