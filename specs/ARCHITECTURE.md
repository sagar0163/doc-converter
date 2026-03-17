# Architecture Document: DocConverter

## 1. System Overview

DocConverter is a Node.js CLI tool that handles document format conversion. It uses a modular architecture with converters for different format pairs.

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      CLI Interface                          │
│                  (Commander.js)                            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  Conversion Manager                         │
│              - Format detection                             │
│              - Converter selection                          │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ Markdown │    │   HTML   │    │   PDF    │
    │Converter│    │Converter │    │Converter │
    └──────────┘    └──────────┘    └──────────┘
```

## 3. File Structure

```
doc-converter/
├── src/               # Source code
├── specs/             # Documentation
├── package.json
└── README.md
```

---

*Document Version: 1.0*  
*Created: 2026-03-17*
