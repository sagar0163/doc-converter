# CHANGELOG

## [Unreleased]

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