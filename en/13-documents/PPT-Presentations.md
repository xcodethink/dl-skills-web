> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: H-Document-Processing

---
name: ppt-presentations
description: Create, edit, and analyze .pptx files using html2pptx for creation, OOXML for editing, and templates for consistent branding
---

# PPTX Creation, Editing, and Analysis

## Overview

Create, edit, and analyze .pptx files. A .pptx file is essentially a ZIP archive containing XML files and other resources that can be read or edited. Different tools and workflows apply to different tasks.

## Reading and Analyzing Content

### Text Extraction
To read only the text content of a presentation, convert it to Markdown:

```bash
# Convert document to Markdown
python -m markitdown path-to-file.pptx
```

### Raw XML Access
Raw XML access is needed for: comments, speaker notes, slide layouts, animations, design elements, and complex formatting. For these features, unpack the presentation and read the raw XML content.

#### Unpack File
`python ooxml/scripts/unpack.py <office_file> <output_dir>`

**Note**: The unpack.py script is located at `skills/pptx/ooxml/scripts/unpack.py` relative to the project root. If the script is not found at that path, use `find . -name "unpack.py"` to locate it.

#### Key File Structure
* `ppt/presentation.xml` - Main presentation metadata and slide references
* `ppt/slides/slide{N}.xml` - Individual slide content (slide1.xml, slide2.xml, etc.)
* `ppt/notesSlides/notesSlide{N}.xml` - Speaker notes for each slide
* `ppt/comments/modernComment_*.xml` - Comments on specific slides
* `ppt/slideLayouts/` - Slide layout templates
* `ppt/slideMasters/` - Master slide templates
* `ppt/theme/` - Theme and style information
* `ppt/media/` - Images and other media files

#### Font and Color Extraction
**When mimicking an example design**: Always analyze the presentation's fonts and colors first:
1. **Read theme file**: Check `ppt/theme/theme1.xml` for colors (`<a:clrScheme>`) and fonts (`<a:fontScheme>`)
2. **Inspect slide content**: Check `ppt/slides/slide1.xml` for actual font usage (`<a:rPr>`) and colors
3. **Search patterns**: Use grep across all XML files for colors (`<a:solidFill>`, `<a:srgbClr>`) and font references

## Create New PowerPoint Without Template

When creating a new PowerPoint presentation from scratch, use the **html2pptx** workflow to convert HTML slides to PowerPoint with precise positioning.

### Design Principles

**Key**: Before creating any presentation, analyze the content and choose appropriate design elements:
1. **Consider the theme**: What is the presentation about? What tone, industry, or atmosphere does it suggest?
2. **Check branding**: If the user mentions a company/organization, consider their brand colors and identity
3. **Match colors to content**: Choose colors that reflect the subject matter
4. **Explain the approach**: Describe design choices before writing code

**Requirements**:
- Explain the content-based design approach before writing code
- Use only web-safe fonts: Arial, Helvetica, Times New Roman, Georgia, Courier New, Verdana, Tahoma, Trebuchet MS, Impact
- Create clear visual hierarchy through size, weight, and color
- Ensure readability: strong contrast, appropriately sized text, clean alignment
- Maintain consistency: repeat patterns, spacing, and visual language across slides

#### Color Scheme Selection

**Choose colors creatively**:
- **Go beyond defaults**: What colors truly match this specific topic? Avoid automatic choices.
- **Consider multiple angles**: Theme, industry, mood, energy level, target audience, brand identity (if mentioned)
- **Be bold**: Try unexpected combinations -- healthcare presentations need not be green, finance need not be navy
- **Build a palette**: Select 3-5 coordinated colors (primary + secondary + accent)
- **Ensure contrast**: Text must be clearly readable against backgrounds

**Example color schemes** (for creative inspiration -- pick one, adapt, or create your own):

1. **Classic Blue**: Deep navy (#1C2833), slate (#2E4053), silver (#AAB7B8), off-white (#F4F6F6)
2. **Teal & Coral**: Teal (#5EA8A7), deep teal (#277884), coral (#FE4447), white (#FFFFFF)
3. **Bold Red**: Red (#C0392B), bright red (#E74C3C), orange (#F39C12), yellow (#F1C40F), green (#2ECC71)
4. **Warm Blush**: Mauve (#A49393), blush (#EED6D3), rose (#E8B4B8), cream (#FAF7F2)
5. **Burgundy Luxury**: Burgundy (#5D1D2E), crimson (#951233), rust (#C15937), gold (#997929)
6. **Deep Purple & Emerald**: Purple (#B165FB), dark blue (#181B24), emerald (#40695B), white (#FFFFFF)
7. **Cream & Forest**: Cream (#FFE1C7), forest (#40695B), white (#FCFCFC)
8. **Pink & Purple**: Pink (#F8275B), coral (#FF574A), rose (#FF737D), purple (#3D2F68)
9. **Lime & Plum**: Lime (#C5DE82), plum (#7C3A5F), coral (#FD8C6E), blue-gray (#98ACB5)
10. **Black & Gold**: Gold (#BF9A4A), black (#000000), cream (#F4F6F6)
11. **Sage & Terracotta**: Sage (#87A96B), terracotta (#E07A5F), cream (#F4F1DE), charcoal (#2C2C2C)
12. **Charcoal & Red**: Charcoal (#292929), red (#E33737), light gray (#CCCBCB)
13. **Vibrant Orange**: Orange (#F96D00), light gray (#F2F2F2), charcoal (#222831)
14. **Forest Green**: Black (#191A19), green (#4E9F3D), dark green (#1E5128), white (#FFFFFF)
15. **Retro Rainbow**: Purple (#722880), pink (#D72D51), orange (#EB5C18), amber (#F08800), gold (#DEB600)
16. **Vintage Earth**: Mustard (#E3B448), sage (#CBD18F), forest (#3A6B35), cream (#F4F1DE)
17. **Coastal Rose**: Old rose (#AD7670), beaver (#B49886), eggshell (#F3ECDC), gray-green (#BFD5BE)
18. **Orange & Teal**: Light orange (#FC993E), gray-teal (#667C6F), white (#FCFCFC)

#### Visual Detail Options

**Geometric Patterns**:
- Diagonal divisions instead of horizontal
- Asymmetric column widths (30/70, 40/60, 25/75)
- Rotated text headers at 90 or 270 degrees
- Circular/hexagonal image frames
- Corner triangle accents
- Overlapping shapes for depth

**Border and Frame Treatments**:
- Thick single-color border on one side only (10-20pt)
- Double-line borders in contrasting colors
- Corner brackets instead of full frames
- L-shaped borders (top+left or bottom+right)
- Underline emphasis below headings (3-5pt thick)

**Typography Treatments**:
- Extreme size contrast (72pt heading vs 11pt body)
- All-caps headings with wide letter-spacing
- Oversized display numbers for numbered sections
- Monospace font (Courier New) for data/statistics/technical content
- Narrow font (Arial Narrow) for dense information
- Outlined text for emphasis

**Chart and Data Styles**:
- Monochrome charts with a single accent color highlighting key data
- Horizontal bar charts instead of vertical
- Dot plots instead of bar charts
- Minimal or no grid lines
- Data labels directly on elements (no legend)
- Oversized numbers for key metrics

**Layout Innovations**:
- Full-bleed images with text overlay
- Sidebar (20-30% width) for navigation/context
- Modular grid system (3x3, 4x4 blocks)
- Z-pattern or F-pattern content flow
- Floating text boxes over colored shapes
- Magazine-style multi-column layouts

**Background Treatments**:
- Solid color blocks covering 40-60% of the slide
- Gradient fills (vertical or diagonal only)
- Split backgrounds (two colors, diagonal or vertical)
- Edge-to-edge color bands
- Negative space as a design element

### Layout Tips
**When creating slides with charts or tables:**
- **Two-column layout (recommended)**: Use a full-width heading with two columns below -- one for text/bullets, the other for featured content. Use flexbox with unequal column widths (e.g., 40%/60% split) to optimize space for each content type.
- **Full-slide layout**: Let featured content (chart/table) fill the entire slide for maximum impact and readability
- **Never stack vertically**: Do not place charts/tables below single-column text -- this results in poor readability and layout issues

### Workflow
1. **Must -- Read complete file**: Read [`html2pptx.md`](html2pptx.md) in full. **Never set a range limit when reading this file.**
2. Create HTML files for each slide with correct dimensions (e.g., 720pt x 405pt for 16:9)
   - Use `<p>`, `<h1>`-`<h6>`, `<ul>`, `<ol>` for all text content
   - Use `class="placeholder"` for areas where charts/tables will be added (renders with gray background for visibility)
   - **Key**: First rasterize gradients and icons as PNG images using Sharp, then reference in HTML
   - **Layout**: Use full-slide or two-column layout for slides with charts/tables/images for readability
3. Create and run a JavaScript file using the [`html2pptx.js`](scripts/html2pptx.js) library to convert HTML slides to PowerPoint and save
   - Use the `html2pptx()` function for each HTML file
   - Use PptxGenJS API to add charts and tables in placeholder areas
   - Use `pptx.writeFile()` to save the presentation
4. **Visual verification**: Generate thumbnails and check for layout issues
   - Create thumbnail grid: `python scripts/thumbnail.py output.pptx workspace/thumbnails --cols 4`
   - Read and carefully inspect the thumbnail image for:
     - **Text truncation**: Text cut off by title bars, shapes, or slide edges
     - **Text overlap**: Text overlapping other text or shapes
     - **Positioning issues**: Content too close to slide boundaries or other elements
     - **Contrast issues**: Insufficient contrast between text and background
   - If issues found, adjust HTML margins/spacing/colors and regenerate the presentation
   - Repeat until all slides are visually correct

## Edit Existing PowerPoint Presentation

When editing slides in an existing PowerPoint presentation, use the raw Office Open XML (OOXML) format. This involves unpacking the .pptx file, editing XML content, then repacking.

### Workflow
1. **Must -- Read complete file**: Read [`ooxml.md`](ooxml.md) (~500 lines) in full. **Never set a range limit when reading this file.**
2. Unpack the presentation: `python ooxml/scripts/unpack.py <office_file> <output_dir>`
3. Edit XML files (primarily `ppt/slides/slide{N}.xml` and related files)
4. **Key**: Validate immediately after each edit and fix any validation errors before proceeding: `python ooxml/scripts/validate.py <dir> --original <file>`
5. Pack the final presentation: `python ooxml/scripts/pack.py <input_directory> <office_file>`

## Create New PowerPoint Using Template

When creating a presentation that follows an existing template design, duplicate and rearrange template slides, then replace placeholder content.

### Workflow
1. **Extract template text and create visual thumbnail grid**:
   * Extract text: `python -m markitdown template.pptx > template-content.md`
   * Read `template-content.md`: Read the full file to understand the template presentation's content. **Never set a range limit when reading this file.**
   * Create thumbnail grid: `python scripts/thumbnail.py template.pptx`
   * See [Creating Thumbnail Grids](#creating-thumbnail-grids) section for details

2. **Analyze template and save inventory to file**:
   * **Visual analysis**: Review the thumbnail grid to understand slide layouts, design patterns, and visual structure
   * Create and save a template inventory file at `template-inventory.md` containing:
     ```markdown
     # Template Inventory Analysis
     **Total Slides: [count]**
     **Important: Slides are 0-indexed (first = 0, last = count-1)**

     ## [Category Name]
     - Slide 0: [Layout code (if applicable)] - Description/purpose
     - Slide 1: [Layout code] - Description/purpose
     - Slide 2: [Layout code] - Description/purpose
     [... every slide must be listed individually with its index ...]
     ```
   * This inventory file is **required** for selecting appropriate templates in the next step

3. **Create presentation outline based on template inventory**:
   * Review available templates from step 2
   * Select an introduction or title template for the first slide
   * Select safe, text-based layouts for other slides
   * **Key: Match layout structure to actual content**:
     - Single-column layouts: For unified narrative or single topic
     - Two-column layouts: Only when there are exactly 2 distinct items/concepts
     - Three-column layouts: Only when there are exactly 3 distinct items/concepts
     - Image layouts: Only when there are actual images to insert
     - Quote layouts: Only for actual person quotes (with attribution), never for emphasis
   * Count actual content pieces before choosing a layout
   * Save `outline.md` with content and template mapping

4. **Use `rearrange.py` to duplicate, reorder, and delete slides**:
   ```bash
   python scripts/rearrange.py template.pptx working.pptx 0,34,34,50,52
   ```
   * The script automatically handles duplicating slides, deleting unused slides, and reordering
   * Slide indices are 0-based (first slide is 0, second is 1, etc.)
   * The same index can appear multiple times to duplicate that slide

5. **Use `inventory.py` script to extract all text**:
   ```bash
   python scripts/inventory.py working.pptx text-inventory.json
   ```
   * Read the full text-inventory.json file to understand all shapes and their properties. **Never set a range limit when reading this file.**
   * JSON structure contains slide, shape, and paragraph information sorted by visual position

6. **Generate replacement text and save data to JSON file**:
   - **Key**: First verify which shapes exist in the inventory -- only reference shapes that actually exist
   - **Auto-clearing**: All text shapes in the inventory will be cleared unless you provide "paragraphs" for them
   - Add "paragraphs" field for shapes that need content (not "replacement_paragraphs")
   - Shapes in the replacement JSON without "paragraphs" will have their text automatically cleared
   - Include paragraph properties from the original inventory -- do not provide text only
   - **Important**: When bullet: true, do not include bullet characters (-, *) in text -- they are added automatically
   - Save updated inventory and replacement content to `replacement-text.json`

   Paragraph field example (showing correct format):
   ```json
   "paragraphs": [
     {
       "text": "New Presentation Title Text",
       "alignment": "CENTER",
       "bold": true
     },
     {
       "text": "Section Heading",
       "bold": true
     },
     {
       "text": "First bullet point without bullet character",
       "bullet": true,
       "level": 0
     },
     {
       "text": "Normal paragraph text with no special formatting"
     }
   ]
   ```

7. **Use `replace.py` script to apply replacements**:
   ```bash
   python scripts/replace.py working.pptx replacement-text.json output.pptx
   ```

## Creating Thumbnail Grids

Create visual thumbnail grids of PowerPoint slides for quick analysis and reference:

```bash
python scripts/thumbnail.py template.pptx [output_prefix]
```

**Features**:
- Creates: `thumbnails.jpg` (or `thumbnails-1.jpg`, `thumbnails-2.jpg`, etc. for large presentations)
- Default: 5 columns, max 30 slides per grid (5x6)
- Custom prefix: `python scripts/thumbnail.py template.pptx my-grid`
- Adjust columns: `--cols 4` (range: 3-6, affects slides per grid)
- Grid limits: 3 cols = 12 slides/grid, 4 cols = 20, 5 cols = 30, 6 cols = 42
- Slides are zero-indexed (Slide 0, Slide 1, etc.)

**Use cases**:
- Template analysis: Quickly understand slide layouts and design patterns
- Content review: Visual overview of the entire presentation
- Navigation reference: Find specific slides by visual appearance
- Quality check: Verify all slides are formatted correctly

## Converting Slides to Images

To visually analyze PowerPoint slides, convert to images via a two-step process:

1. **Convert PPTX to PDF**:
   ```bash
   soffice --headless --convert-to pdf template.pptx
   ```

2. **Convert PDF pages to JPEG images**:
   ```bash
   pdftoppm -jpeg -r 150 template.pdf slide
   ```
   This creates `slide-1.jpg`, `slide-2.jpg`, etc.

## Code Style Guide
**Important**: When generating code for PPTX operations:
- Write concise code
- Avoid verbose variable names and redundant operations
- Avoid unnecessary print statements

## Dependencies

Required dependencies (should already be installed):

- **markitdown**: `pip install "markitdown[pptx]"` (for text extraction from presentations)
- **pptxgenjs**: `npm install -g pptxgenjs` (for creating presentations via html2pptx)
- **playwright**: `npm install -g playwright` (for HTML rendering in html2pptx)
- **react-icons**: `npm install -g react-icons react react-dom` (for icons)
- **sharp**: `npm install -g sharp` (for SVG rasterization and image processing)
- **LibreOffice**: `sudo apt-get install libreoffice` (for PDF conversion)
- **Poppler**: `sudo apt-get install poppler-utils` (for pdftoppm PDF-to-image conversion)
- **defusedxml**: `pip install defusedxml` (for safe XML parsing)
