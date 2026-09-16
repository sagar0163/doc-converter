# Business Requirements Document (BRD)

## Project Overview
- **Project Name**: DocConverter
- **Type**: Document Format Converter
- **Core Functionality**: Convert Markdown to HTML via CLI and Node.js API
- **Target Users**: Developers, DevOps engineers, content creators

## Features
1. **Markdown → HTML Conversion** - Implemented (headers, bold, italic, code,
   links, images, lists)
2. **CLI Interface** - Implemented (`doc-convert`)
3. **Programmatic API** - Implemented (`DocumentConverter` class)
4. **DevOps Ready** - Docker image, GitHub Actions CI (lint + tests + security
   audit), release workflow
5. **PDF Conversion** - **Planned**; currently a placeholder
6. **DOCX Conversion** - **Planned**; currently a placeholder
7. **Batch Conversion** - **Planned**; multiple-file processing is not yet
   implemented
8. **Formatting Preservation** - **Planned**; no style/preservation engine exists

## Tech Stack
- **Runtime**: Node.js (ESM)
- **Package Manager**: npm
- **Libraries**: none at runtime other than `chalk` (CLI output) — Markdown
  conversion is hand-written (regex-based), not markdown-it
- **DevOps**: Docker, GitHub Actions, Vitest, ESLint, release-it

> Note: earlier drafts referenced markdown-it, pdfkit, docx, and puppeteer.
> Those libraries are **not** installed or used. PDF/DOCX engines are planned
> stubs only.

## User Stories
1. As a developer, I want to convert Markdown to HTML so that I can publish web content _(implemented)_
2. As a content creator, I want to convert DOCX to PDF so that I can share read-only documents _(planned - not yet available)_
3. As a DevOps engineer, I want batch conversion so that I can automate document processing _(planned - not yet available)_

## Requirements
- Node.js 18+
- npm or yarn
- Docker (optional, for the image)

## Future Enhancements
- Real PDF generation (puppeteer or equivalent)
- DOCX conversion (mammoth or equivalent)
- Batch conversion
- Formatting/style preservation
- GUI (Electron/React)
- Cloud storage integration
- Custom templates
- OCR support for images
- Real-time collaboration