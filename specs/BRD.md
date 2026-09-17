# Business Requirements Document (BRD)

## Project Overview
- **Project Name**: DocConverter
- **Type**: Document Format Converter
- **Core Functionality**: Convert documents between formats via CLI and Node.js API
- **Target Users**: Developers, DevOps engineers, content creators

## Features
1. **Markdown → HTML Conversion** - Implemented (headers, bold, italic, code,
   links, images, lists)
2. **CLI Interface** - Implemented (`doc-convert`)
3. **Programmatic API** - Implemented (`DocumentConverter` class)
4. **DevOps Ready** - Docker image, GitHub Actions CI (lint + tests + security
   audit), release workflow
5. **PDF Conversion** - **Implemented** (Markdown → PDF and HTML → PDF via
   Puppeteer)
6. **DOCX Conversion** - **Implemented** (DOCX → Markdown via mammoth)
7. **Batch Conversion** - **Planned**; multiple-file processing is not yet
   implemented
8. **Formatting Preservation** - **Planned**; no style/preservation engine exists

## Tech Stack
- **Runtime**: Node.js (ESM)
- **Package Manager**: npm
- **Libraries**:
  - `chalk` (CLI output)
  - `puppeteer-core` (HTML → PDF; uses a system Chrome/Chromium binary)
  - `mammoth` (DOCX → Markdown)
  - Markdown → HTML conversion is hand-written (regex-based), not markdown-it
- **DevOps**: Docker, GitHub Actions, Vitest, ESLint, release-it

## User Stories
1. As a developer, I want to convert Markdown to HTML so that I can publish web content _(implemented)_
2. As a developer, I want to convert Markdown or HTML to PDF so that I can share read-only documents _(implemented)_
3. As a content creator, I want to convert DOCX to Markdown so that I can reuse my Word documents _(implemented)_
4. As a DevOps engineer, I want batch conversion so that I can automate document processing _(planned - not yet available)_

## Requirements
- Node.js 18+
- npm or yarn
- Chrome/Chromium binary for PDF conversion (auto-detected, or set `CHROME_PATH`)
- Docker (optional, for the image)

## Future Enhancements
- Batch conversion
- Formatting/style preservation
- DOCX → PDF
- GUI (Electron/React)
- Cloud storage integration
- Custom templates
- OCR support for images
- Real-time collaboration