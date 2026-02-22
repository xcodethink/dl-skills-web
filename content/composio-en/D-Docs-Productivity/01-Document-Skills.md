> Source: [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Category: Docs & Productivity

---
name: document-skills
description: Comprehensive toolkit for creating, editing, and analyzing DOCX, PDF, and PPTX files -- including tracked changes, form filling, presentations from templates, and text extraction.
---

# Document Skills (DOCX, PDF, PPTX)

## Overview

This skill provides a complete document processing toolkit across three major office formats. It covers creating new documents from scratch, editing existing files with tracked changes, extracting text and tables, filling PDF forms, building PowerPoint presentations from HTML or templates, and converting documents to images for visual analysis. Each format has its own workflow and tooling.

---

## Part 1: DOCX -- Word Document Processing

### Workflow Decision Tree

| Task | Workflow |
|------|----------|
| Read/analyze content | Text extraction or raw XML access |
| Create new document | docx-js (JavaScript) |
| Edit your own document (simple changes) | Basic OOXML editing |
| Edit someone else's document | Redlining workflow |
| Legal, academic, business, or government docs | Redlining workflow (required) |

### Reading and Analyzing Content

**Text extraction with pandoc**:
```bash
# Convert to markdown with tracked changes
pandoc --track-changes=all path-to-file.docx -o output.md
# Options: --track-changes=accept/reject/all
```

**Raw XML access** (for comments, complex formatting, metadata, embedded media):
```bash
python ooxml/scripts/unpack.py <office_file> <output_directory>
```

Key file structures:
- `word/document.xml` -- Main document contents
- `word/comments.xml` -- Comments referenced in document.xml
- `word/media/` -- Embedded images and media files
- Tracked changes use `<w:ins>` (insertions) and `<w:del>` (deletions) tags

### Creating a New Word Document

Uses **docx-js** (JavaScript/TypeScript):

1. Read the `docx-js.md` reference file completely
2. Create a JavaScript file using Document, Paragraph, TextRun components
3. Export as .docx using `Packer.toBuffer()`

### Editing an Existing Document

Uses the **Document library** (Python for OOXML manipulation):

1. Read the `ooxml.md` reference file completely
2. Unpack: `python ooxml/scripts/unpack.py <office_file> <output_directory>`
3. Create and run a Python script using the Document library
4. Pack: `python ooxml/scripts/pack.py <input_directory> <office_file>`

### Redlining Workflow (Tracked Changes)

For professional document review with tracked changes:

**Principle**: Minimal, precise edits. Only mark text that actually changes.

```python
# BAD - Replaces entire sentence
'<w:del>..The term is 30 days..</w:del><w:ins>..The term is 60 days..</w:ins>'

# GOOD - Only marks what changed
'..The term is ..<w:del>..30..</w:del><w:ins>..60..</w:ins>.. days..'
```

**Batch strategy**: Group related changes into batches of 3-10. Test each batch before moving to the next.

**Steps**:
1. Get markdown representation: `pandoc --track-changes=all file.docx -o current.md`
2. Identify and group changes by section, type, or proximity
3. Read `ooxml.md`, then unpack the document
4. Implement changes in batches using the Document library
5. Pack the document: `python ooxml/scripts/pack.py unpacked reviewed.docx`
6. Verify: Convert final document to markdown and check all changes applied

### Converting to Images

```bash
# Step 1: DOCX to PDF
soffice --headless --convert-to pdf document.docx

# Step 2: PDF pages to JPEG
pdftoppm -jpeg -r 150 document.pdf page
# Creates page-1.jpg, page-2.jpg, etc.
```

### Dependencies

- **pandoc** -- Text extraction
- **docx** (npm) -- Creating new documents
- **LibreOffice** -- PDF conversion
- **Poppler** (poppler-utils) -- PDF to images
- **defusedxml** (pip) -- Secure XML parsing

---

## Part 2: PDF Processing

### Quick Start

```python
from pypdf import PdfReader, PdfWriter

reader = PdfReader("document.pdf")
print(f"Pages: {len(reader.pages)}")

text = ""
for page in reader.pages:
    text += page.extract_text()
```

### Common Operations

| Task | Best Tool | Example |
|------|-----------|---------|
| Merge PDFs | pypdf | `writer.add_page(page)` |
| Split PDFs | pypdf | One page per file |
| Extract text | pdfplumber | `page.extract_text()` |
| Extract tables | pdfplumber | `page.extract_tables()` |
| Create PDFs | reportlab | Canvas or Platypus |
| CLI merge | qpdf | `qpdf --empty --pages ...` |
| OCR scanned PDFs | pytesseract | Convert to image first |
| Fill PDF forms | pypdf or pdf-lib | See forms workflow below |

### Merge PDFs

```python
from pypdf import PdfWriter, PdfReader

writer = PdfWriter()
for pdf_file in ["doc1.pdf", "doc2.pdf", "doc3.pdf"]:
    reader = PdfReader(pdf_file)
    for page in reader.pages:
        writer.add_page(page)

with open("merged.pdf", "wb") as output:
    writer.write(output)
```

### Extract Tables

```python
import pdfplumber
import pandas as pd

with pdfplumber.open("document.pdf") as pdf:
    all_tables = []
    for page in pdf.pages:
        tables = page.extract_tables()
        for table in tables:
            if table:
                df = pd.DataFrame(table[1:], columns=table[0])
                all_tables.append(df)

if all_tables:
    combined_df = pd.concat(all_tables, ignore_index=True)
    combined_df.to_excel("extracted_tables.xlsx", index=False)
```

### Create PDFs with reportlab

```python
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet

doc = SimpleDocTemplate("report.pdf", pagesize=letter)
styles = getSampleStyleSheet()
story = []

title = Paragraph("Report Title", styles['Title'])
story.append(title)
story.append(Spacer(1, 12))

body = Paragraph("This is the body of the report. " * 20, styles['Normal'])
story.append(body)

doc.build(story)
```

### OCR Scanned PDFs

```python
import pytesseract
from pdf2image import convert_from_path

images = convert_from_path('scanned.pdf')
text = ""
for i, image in enumerate(images):
    text += f"Page {i+1}:\n"
    text += pytesseract.image_to_string(image)
    text += "\n\n"
```

### Command-Line Tools

```bash
# Extract text preserving layout
pdftotext -layout input.pdf output.txt

# Merge PDFs
qpdf --empty --pages file1.pdf file2.pdf -- merged.pdf

# Split pages
qpdf input.pdf --pages . 1-5 -- pages1-5.pdf

# Remove password
qpdf --password=mypassword --decrypt encrypted.pdf decrypted.pdf
```

### PDF Form Filling

**For fillable forms** (with form fields):
1. Check fields: `python scripts/check_fillable_fields.py <file.pdf>`
2. Extract field info: `python scripts/extract_form_field_info.py <input.pdf> <field_info.json>`
3. Convert to images for visual analysis: `python scripts/convert_pdf_to_images.py <file.pdf> <output_dir>`
4. Create `field_values.json` with values for each field
5. Fill: `python scripts/fill_fillable_fields.py <input.pdf> <field_values.json> <output.pdf>`

**For non-fillable forms** (no form fields):
1. Convert PDF to PNG images
2. Identify all form fields and create bounding boxes in `fields.json`
3. Generate validation images and verify bounding boxes
4. Fill using annotation script: `python scripts/fill_pdf_form_with_annotations.py <input.pdf> <fields.json> <output.pdf>`

### Advanced Features

- **pypdfium2** -- Fast PDF rendering and image generation (Chromium's PDF library)
- **pdf-lib** (JavaScript) -- Create and modify PDFs in any JS environment
- **pdfjs-dist** -- Mozilla's library for rendering PDFs in the browser
- **Watermarks**: Merge a watermark PDF onto each page
- **Password protection**: `writer.encrypt("userpass", "ownerpass")`
- **Batch processing**: Process multiple PDFs with error handling

---

## Part 3: PPTX -- Presentation Processing

### Reading and Analyzing Content

**Text extraction**:
```bash
python -m markitdown path-to-file.pptx
```

**Raw XML access**:
```bash
python ooxml/scripts/unpack.py <office_file> <output_dir>
```

Key file structures:
- `ppt/presentation.xml` -- Main metadata and slide references
- `ppt/slides/slide{N}.xml` -- Individual slide contents
- `ppt/notesSlides/notesSlide{N}.xml` -- Speaker notes
- `ppt/slideLayouts/` -- Layout templates
- `ppt/slideMasters/` -- Master slide templates
- `ppt/theme/` -- Theme and styling
- `ppt/media/` -- Images and media

### Creating a Presentation Without a Template

Uses the **html2pptx** workflow:

1. Read `html2pptx.md` completely
2. Create HTML files for each slide (720pt x 405pt for 16:9)
3. Run html2pptx.js to convert HTML to PowerPoint
4. Validate visually with thumbnail grid: `python scripts/thumbnail.py output.pptx`
5. Fix any issues and regenerate

**Design principles**:
- State your content-informed design approach before writing code
- Use web-safe fonts only (Arial, Helvetica, Georgia, Verdana, etc.)
- Create clear visual hierarchy through size, weight, and color
- Ensure strong contrast and readability
- Be consistent across slides

**Layout tips**:
- Two-column layout preferred for charts/tables (header full-width, content split below)
- Full-slide layout for maximum impact
- Never vertically stack charts/tables below text

### Creating a Presentation Using a Template

1. Extract text and create thumbnail grid from template
2. Analyze template and save inventory to `template-inventory.md`
3. Create presentation outline with template mapping in `outline.md`
4. Rearrange slides: `python scripts/rearrange.py template.pptx working.pptx 0,34,34,50,52`
5. Extract text inventory: `python scripts/inventory.py working.pptx text-inventory.json`
6. Generate replacement text in `replacement-text.json`
7. Apply replacements: `python scripts/replace.py working.pptx replacement-text.json output.pptx`

### Editing an Existing Presentation

1. Read `ooxml.md` completely
2. Unpack: `python ooxml/scripts/unpack.py <file> <output_dir>`
3. Edit XML files (primarily `ppt/slides/slide{N}.xml`)
4. Validate after each edit: `python ooxml/scripts/validate.py <dir> --original <file>`
5. Pack: `python ooxml/scripts/pack.py <input_dir> <output_file>`

### Thumbnail Grids

```bash
# Basic usage
python scripts/thumbnail.py presentation.pptx

# Custom columns
python scripts/thumbnail.py template.pptx analysis --cols 4
```

Features: 5 columns default, max 30 slides per grid, zero-indexed slide numbers.

### Converting Slides to Images

```bash
soffice --headless --convert-to pdf template.pptx
pdftoppm -jpeg -r 150 template.pdf slide
```

### Color Palette Options

18 built-in palette suggestions ranging from Classic Blue to Retro Rainbow. Select one, adapt it, or create your own. Always ensure text contrast against backgrounds.

### Dependencies

- **markitdown** (pip) -- Text extraction from presentations
- **pptxgenjs** (npm) -- Creating presentations via html2pptx
- **playwright** (npm) -- HTML rendering
- **sharp** (npm) -- SVG rasterization and image processing
- **LibreOffice** -- PDF conversion
- **Poppler** -- PDF to images
- **defusedxml** (pip) -- Secure XML parsing
