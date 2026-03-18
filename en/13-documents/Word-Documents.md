> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: H-Document-Processing

---
name: word-documents
description: Create, edit, and analyze .docx files using docx-js for creation, OOXML for editing, and pandoc for text extraction with tracked changes
---

# DOCX Creation, Editing, and Analysis

## Overview

Create, edit, and analyze .docx files. A .docx file is essentially a ZIP archive containing XML files and other resources that can be read or edited. Different tools and workflows apply to different tasks.

## Workflow Decision Tree

### Read/Analyze Content
Use "Text Extraction" or "Raw XML Access" sections below

### Create New Documents
Use the "Create New Word Document" workflow

### Edit Existing Documents
- **Own document + simple changes**
  Use the "Basic OOXML Editing" workflow

- **Someone else's document**
  Use the **"Tracked Changes Workflow"** (recommended default)

- **Legal, academic, business, or government documents**
  Use the **"Tracked Changes Workflow"** (required)

## Reading and Analyzing Content

### Text Extraction
To read only the text content of a document, use pandoc to convert it to Markdown. Pandoc has excellent support for preserving document structure and can display tracked changes:

```bash
# Convert document to Markdown with tracked changes preserved
pandoc --track-changes=all path-to-file.docx -o output.md
# Options: --track-changes=accept/reject/all
```

### Raw XML Access
Raw XML access is needed for: comments, complex formatting, document structure, embedded media, and metadata. For these features, unpack the document and read the raw XML content.

#### Unpack File
`python ooxml/scripts/unpack.py <office_file> <output_directory>`

#### Key File Structure
* `word/document.xml` - Main document content
* `word/comments.xml` - Comments referenced from document.xml
* `word/media/` - Embedded images and media files
* Tracked changes use `<w:ins>` (insertions) and `<w:del>` (deletions) tags

## Create New Word Document

When creating a new Word document from scratch, use **docx-js**, which allows creating Word documents using JavaScript/TypeScript.

### Workflow
1. **Must -- Read complete file**: Read [`docx-js.md`](docx-js.md) (~500 lines) in full, from start to finish. **Never set a range limit when reading this file.** Read the complete file content to understand detailed syntax, key formatting rules, and best practices before starting document creation.
2. Create a JavaScript/TypeScript file using Document, Paragraph, TextRun components (assume all dependencies are installed; if not, see Dependencies section below)
3. Export to .docx using Packer.toBuffer()

## Edit Existing Word Document

When editing an existing Word document, use the **Document library** (a Python library for OOXML manipulation). The library automatically handles infrastructure setup and provides document manipulation methods. For complex scenarios, access the underlying DOM directly through the library.

### Workflow
1. **Must -- Read complete file**: Read [`ooxml.md`](ooxml.md) (~600 lines) in full, from start to finish. **Never set a range limit when reading this file.** Read the complete file content to understand the Document library API and XML patterns for direct document file editing.
2. Unpack the document: `python ooxml/scripts/unpack.py <office_file> <output_directory>`
3. Create and run a Python script using the Document library (see the "Document Library" section in ooxml.md)
4. Pack the final document: `python ooxml/scripts/pack.py <input_directory> <office_file>`

The Document library provides high-level methods for common operations and also supports direct DOM access for complex scenarios.

## Tracked Changes Workflow for Document Review

This workflow allows planning comprehensive tracked changes using Markdown before implementing them in OOXML. **Key**: For complete tracked changes, all changes must be systematically implemented.

**Batch Strategy**: Group related changes into batches of 3-10 changes. This keeps debugging manageable while maintaining efficiency. Test each batch before moving to the next.

**Principle: Minimal, Precise Edits**
When implementing tracked changes, mark only the text that actually changed. Repeating unchanged text makes edits harder to review and appears unprofessional. Split replacements into: [unchanged text] + [deletion] + [insertion] + [unchanged text]. Preserve original run RSIDs by extracting `<w:r>` elements from the original and reusing them.

Example -- changing "30 days" to "60 days" in a sentence:
```python
# Wrong approach - replaces entire sentence
'<w:del><w:r><w:delText>The term is 30 days.</w:delText></w:r></w:del><w:ins><w:r><w:t>The term is 60 days.</w:t></w:r></w:ins>'

# Correct approach - marks only actual changes, preserves original <w:r> for unchanged text
'<w:r w:rsidR="00AB12CD"><w:t>The term is </w:t></w:r><w:del><w:r><w:delText>30</w:delText></w:r></w:del><w:ins><w:r><w:t>60</w:t></w:r></w:ins><w:r w:rsidR="00AB12CD"><w:t> days.</w:t></w:r>'
```

### Tracked Changes Workflow Steps

1. **Get Markdown representation**: Convert the document to Markdown preserving tracked changes:
   ```bash
   pandoc --track-changes=all path-to-file.docx -o current.md
   ```

2. **Identify and group changes**: Review the document and identify all needed changes, organized into logical batches:

   **Locating methods** (for finding change positions in XML):
   - Section/heading numbers (e.g., "Section 3.2", "Article IV")
   - Paragraph identifiers (if numbered)
   - Grep patterns with unique context text
   - Document structure (e.g., "first paragraph", "signature block")
   - **Do not use Markdown line numbers** -- they do not map to XML structure

   **Batch organization** (3-10 related changes per batch):
   - By section: "Batch 1: Section 2 edits", "Batch 2: Section 5 updates"
   - By type: "Batch 1: Date corrections", "Batch 2: Party name changes"
   - By complexity: Start with simple text replacements, then tackle complex structural changes
   - By order: "Batch 1: Pages 1-3", "Batch 2: Pages 4-6"

3. **Read document and unpack**:
   - **Must -- Read complete file**: Read [`ooxml.md`](ooxml.md) (~600 lines) in full. Pay special attention to "Document Library" and "Tracked Change Patterns" sections.
   - **Unpack document**: `python ooxml/scripts/unpack.py <file.docx> <dir>`
   - **Note the suggested RSID**: The unpack script will suggest an RSID for tracked changes. Copy this RSID for use in step 4b.

4. **Implement changes in batches**: Group changes logically (by section, type, or position) and implement them together in a single script.

   For each batch of related changes:

   **a. Map text to XML**: Grep the text in `word/document.xml` to verify how text is distributed across `<w:r>` elements.

   **b. Create and run script**: Use `get_node` to find nodes, implement changes, then `doc.save()`. See the **"Document Library"** section in ooxml.md for patterns.

   **Note**: Always grep `word/document.xml` immediately before writing a script to get current line numbers and verify text content. Line numbers change after each script run.

5. **Pack document**: After all batches are complete, convert the unpacked directory back to .docx:
   ```bash
   python ooxml/scripts/pack.py unpacked reviewed-document.docx
   ```

6. **Final verification**: Perform a comprehensive check on the complete document:
   - Convert the final document to Markdown:
     ```bash
     pandoc --track-changes=all reviewed-document.docx -o verification.md
     ```
   - Verify all changes were applied correctly:
     ```bash
     grep "original phrase" verification.md  # Should not be found
     grep "replacement phrase" verification.md  # Should be found
     ```
   - Check for unintended changes

## Converting Documents to Images

To visually analyze Word documents, convert to images via a two-step process:

1. **Convert DOCX to PDF**:
   ```bash
   soffice --headless --convert-to pdf document.docx
   ```

2. **Convert PDF pages to JPEG images**:
   ```bash
   pdftoppm -jpeg -r 150 document.pdf page
   ```
   This creates `page-1.jpg`, `page-2.jpg`, etc.

Options:
- `-r 150`: Set resolution to 150 DPI (adjust quality/size balance)
- `-jpeg`: Output JPEG format (use `-png` for PNG)
- `-f N`: Starting page to convert (e.g., `-f 2` starts from page 2)
- `-l N`: Last page to convert (e.g., `-l 5` stops at page 5)
- `page`: Output file prefix

Specific range example:
```bash
pdftoppm -jpeg -r 150 -f 2 -l 5 document.pdf page  # Convert pages 2-5 only
```

## Code Style Guide
**Important**: When generating code for DOCX operations:
- Write concise code
- Avoid verbose variable names and redundant operations
- Avoid unnecessary print statements

## Dependencies

Required dependencies (install if not present):

- **pandoc**: `sudo apt-get install pandoc` (for text extraction)
- **docx**: `npm install -g docx` (for creating new documents)
- **LibreOffice**: `sudo apt-get install libreoffice` (for PDF conversion)
- **Poppler**: `sudo apt-get install poppler-utils` (for pdftoppm PDF-to-image conversion)
- **defusedxml**: `pip install defusedxml` (for safe XML parsing)
