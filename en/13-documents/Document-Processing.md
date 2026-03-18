> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Nutrient Document Processing

## Overview

Process documents via the Nutrient DWS Processor API. Supports format conversion, text/table extraction, OCR, PII redaction, watermarks, digital signatures, and PDF form filling across PDF, DOCX, XLSX, PPTX, HTML, and image formats.

## Setup

Get a free API key at [nutrient.io](https://dashboard.nutrient.io/sign_up/?product=processor).

```bash
export NUTRIENT_API_KEY="pdf_live_..."
```

All requests go to `https://api.nutrient.io/build` as multipart POST with an `instructions` JSON field.

## Key Operations

### Format Conversion

Supported inputs: PDF, DOCX, XLSX, PPTX, DOC, XLS, PPT, PPS, PPSX, ODT, RTF, HTML, JPG, PNG, TIFF, HEIC, GIF, WebP, SVG, TGA, EPS.

```bash
# DOCX to PDF
curl -X POST https://api.nutrient.io/build \
  -H "Authorization: Bearer $NUTRIENT_API_KEY" \
  -F "document.docx=@document.docx" \
  -F 'instructions={"parts":[{"file":"document.docx"}]}' \
  -o output.pdf
```

### Text & Data Extraction

Extract plain text or tables (as Excel) from PDFs.

### OCR

Convert scanned documents to searchable PDFs. Supports 100+ languages via ISO 639-2 codes.

### PII Redaction

Pattern-based (presets for SSN, email, credit card, phone, date, URL, IP, etc.) or regex-based redaction.

### Watermarks & Digital Signatures

Add watermarks with customizable text, font size, opacity, and rotation. Self-signed CMS digital signatures.

### PDF Form Filling

Fill form fields programmatically with key-value pairs.

## MCP Server Alternative

For native tool integration:

```json
{
  "mcpServers": {
    "nutrient-dws": {
      "command": "npx",
      "args": ["-y", "@nutrient-sdk/dws-mcp-server"],
      "env": {
        "NUTRIENT_DWS_API_KEY": "YOUR_API_KEY",
        "SANDBOX_PATH": "/path/to/working/directory"
      }
    }
  }
}
```

## When to Use

- Document format conversion (PDF, DOCX, XLSX, PPTX, HTML, images)
- Text, table, or key-value extraction from PDFs
- OCR on scanned documents or images
- PII redaction before sharing documents
- Watermarking drafts or confidential documents
- Digitally signing contracts
- Programmatic PDF form filling

## Links

- [API Playground](https://dashboard.nutrient.io/processor-api/playground/)
- [Full API Docs](https://www.nutrient.io/guides/dws-processor/)
- [Agent Skill Repo](https://github.com/PSPDFKit-labs/nutrient-agent-skill)
- [npm MCP Server](https://www.npmjs.com/package/@nutrient-sdk/dws-mcp-server)
