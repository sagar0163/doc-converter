# CHANGELOG

## [Unreleased]

- Markdown → HTML output is now sanitized by default: raw HTML is escaped into
  entities, text nodes are entity-escaped, and `javascript:`/`data:`/`vbscript:`
  link and image destinations (including obfuscated variants) are replaced with
  a safe `#`. Plain-text → HTML output is entity-escaped too.
- Implemented real PDF conversion (Markdown → PDF, HTML → PDF) using
  `puppeteer-core` with a system Chrome/Chromium binary
- Implemented real DOCX → Markdown conversion using `mammoth`
- CLI now writes binary PDF results as bytes instead of JSON placeholders
- Unsupported format pairs now throw explicit errors instead of silently
  returning the input unchanged

## [0.1.0] - 2026-09-16

- Initial release
- Markdown → HTML conversion via CLI (`doc-convert`) and `DocumentConverter` API
- CI pipeline: lint, tests, security audit, scratch-file guard