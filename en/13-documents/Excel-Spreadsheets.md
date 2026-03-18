> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: H-Document-Processing

---
name: excel-spreadsheets
description: Create, edit, and analyze .xlsx files using openpyxl for formulas/formatting and pandas for data analysis, with formula recalculation via LibreOffice
---

# Excel Spreadsheet Processing

## Output Requirements

### All Excel Files

#### Zero Formula Errors
- Every Excel model **must** be delivered with zero formula errors (#REF!, #DIV/0!, #VALUE!, #N/A, #NAME?)

#### Preserve Existing Templates (When Updating)
- When modifying files, research and **exactly match** existing formatting, styles, and conventions
- Never impose standardized formatting on files with established patterns
- Existing template conventions **always** take precedence over these guidelines

### Financial Models

#### Color Coding Standards
Unless otherwise specified by the user or existing template

##### Industry-Standard Color Conventions
- **Blue text (RGB: 0,0,255)**: Hardcoded inputs and numbers users will change for scenario analysis
- **Black text (RGB: 0,0,0)**: All formulas and calculations
- **Green text (RGB: 0,128,0)**: Links pulling from other sheets within the same workbook
- **Red text (RGB: 255,0,0)**: External links to other files
- **Yellow background (RGB: 255,255,0)**: Key assumptions requiring attention or cells that need updating

#### Number Format Standards

##### Required Format Rules
- **Years**: Format as text strings (e.g., "2024" not "2,024")
- **Currency**: Use $#,##0 format; **always** specify units in headers ("Revenue ($mm)")
- **Zero values**: Display all zeros as "-" using number formatting, including percentages (e.g., "$#,##0;($#,##0);-")
- **Percentages**: Use 0.0% format by default (one decimal place)
- **Multiples**: Use 0.0x format for valuation multiples (EV/EBITDA, P/E)
- **Negative numbers**: Use parentheses (123) not minus sign -123

#### Formula Construction Rules

##### Assumption Placement
- Place all assumptions (growth rates, margins, multiples, etc.) in separate assumption cells
- Use cell references in formulas instead of hardcoded values
- Example: Use =B5*(1+$B$6) not =B5*1.05

##### Formula Error Prevention
- Validate all cell references are correct
- Check for off-by-one errors in ranges
- Ensure formulas are consistent across all forecast periods
- Test with edge cases (zero values, negative numbers)
- Verify no unintended circular references

##### Documentation for Hardcoded Values
- Add comments or callouts next to cells (e.g., at the end of the table). Format: "Source: [System/Document], [Date], [Specific Reference], [URL (if applicable)]"
- Examples:
  - "Source: Company 10-K, FY2024, p.45, Revenue Note, [SEC EDGAR URL]"
  - "Source: Bloomberg Terminal, 8/15/2025, AAPL US Equity"
  - "Source: FactSet, 8/20/2025, Consensus Estimate Screen"

## XLSX Creation, Editing, and Analysis

### Overview

Create, edit, or analyze .xlsx files. Different tools and workflows apply to different tasks.

### Important Requirements

**Formula recalculation requires LibreOffice**: Assume LibreOffice is installed; use the `recalc.py` script to recalculate formula values. The script automatically configures LibreOffice on first run.

## Reading and Analyzing Data

### Data Analysis with pandas
Use **pandas** for data analysis, visualization, and basic operations -- it provides powerful data manipulation capabilities:

```python
import pandas as pd

# Read Excel
df = pd.read_excel('file.xlsx')  # Default: first sheet
all_sheets = pd.read_excel('file.xlsx', sheet_name=None)  # All sheets as dict

# Analysis
df.head()      # Preview data
df.info()      # Column information
df.describe()  # Statistics

# Write Excel
df.to_excel('output.xlsx', index=False)
```

## Excel File Workflows

### Key: Use Formulas, Not Hardcoded Values

**Always use Excel formulas instead of calculating values in Python and hardcoding them.** This ensures the spreadsheet remains dynamic and updatable.

#### Wrong -- Hardcoded Calculated Values
```python
# Wrong: Calculate in Python and hardcode the result
total = df['Sales'].sum()
sheet['B10'] = total  # Hardcoded 5000

# Wrong: Calculate growth rate in Python
growth = (df.iloc[-1]['Revenue'] - df.iloc[0]['Revenue']) / df.iloc[0]['Revenue']
sheet['C5'] = growth  # Hardcoded 0.15

# Wrong: Calculate average in Python
avg = sum(values) / len(values)
sheet['D20'] = avg  # Hardcoded 42.5
```

#### Correct -- Use Excel Formulas
```python
# Correct: Let Excel calculate the sum
sheet['B10'] = '=SUM(B2:B9)'

# Correct: Growth rate as Excel formula
sheet['C5'] = '=(C4-C2)/C2'

# Correct: Average using Excel function
sheet['D20'] = '=AVERAGE(D2:D19)'
```

This applies to **all** calculations -- sums, percentages, ratios, differences, etc. The spreadsheet should be able to recalculate when source data changes.

### General Workflow
1. **Choose tool**: pandas for data analysis, openpyxl for formulas/formatting
2. **Create/Load**: Create a new workbook or load an existing file
3. **Modify**: Add/edit data, formulas, and formatting
4. **Save**: Write to file
5. **Recalculate formulas (required when using formulas)**: Use the recalc.py script
   ```bash
   python recalc.py output.xlsx
   ```
6. **Verify and fix any errors**:
   - The script returns JSON with error details
   - If `status` is `errors_found`, check `error_summary` for specific error types and locations
   - Fix identified errors and recalculate again
   - Common errors to fix:
     - `#REF!`: Invalid cell references
     - `#DIV/0!`: Division by zero
     - `#VALUE!`: Wrong data types in formulas
     - `#NAME?`: Unrecognized formula names

### Create New Excel File

```python
# Create with formulas and formatting using openpyxl
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

wb = Workbook()
sheet = wb.active

# Add data
sheet['A1'] = 'Hello'
sheet['B1'] = 'World'
sheet.append(['Row', 'Data', 'Example'])

# Add formula
sheet['B2'] = '=SUM(A1:A10)'

# Formatting
sheet['A1'].font = Font(bold=True, color='FF0000')
sheet['A1'].fill = PatternFill('solid', start_color='FFFF00')
sheet['A1'].alignment = Alignment(horizontal='center')

# Column width
sheet.column_dimensions['A'].width = 20

wb.save('output.xlsx')
```

### Edit Existing Excel File

```python
# Use openpyxl to preserve formulas and formatting
from openpyxl import load_workbook

# Load existing file
wb = load_workbook('existing.xlsx')
sheet = wb.active  # Or wb['SheetName'] for specific sheet

# Work with multiple sheets
for sheet_name in wb.sheetnames:
    sheet = wb[sheet_name]
    print(f"Sheet: {sheet_name}")

# Modify cells
sheet['A1'] = 'New Value'
sheet.insert_rows(2)  # Insert row at position 2
sheet.delete_cols(3)  # Delete column 3

# Add new sheet
new_sheet = wb.create_sheet('NewSheet')
new_sheet['A1'] = 'Data'

wb.save('modified.xlsx')
```

## Formula Recalculation

Excel files created or modified by openpyxl contain formulas as strings but no calculated values. Use the provided `recalc.py` script to recalculate formulas:

```bash
python recalc.py <excel_file> [timeout_seconds]
```

Example:
```bash
python recalc.py output.xlsx 30
```

Script features:
- Automatically sets up LibreOffice macros on first run
- Recalculates all formulas across all worksheets
- Scans **all** cells for Excel errors (#REF!, #DIV/0!, etc.)
- Returns JSON with detailed error locations and counts
- Works on both Linux and macOS

## Formula Validation Checklist

Quick checks to ensure formulas work correctly:

### Basic Validation
- [ ] **Test 2-3 sample references**: Verify they pull correct values before building the full model
- [ ] **Column mapping**: Confirm Excel columns match (e.g., column 64 = BL, not BK)
- [ ] **Row offset**: Remember Excel rows are 1-indexed (DataFrame row 5 = Excel row 6)

### Common Pitfalls
- [ ] **NaN handling**: Use `pd.notna()` to check for empty values
- [ ] **Rightmost columns**: FY data is often in column 50+
- [ ] **Multiple matches**: Search for all occurrences, not just the first
- [ ] **Division by zero**: Check denominator before using `/` in formulas (#DIV/0!)
- [ ] **Bad references**: Verify all cell references point to intended cells (#REF!)
- [ ] **Cross-sheet references**: Use correct format (Sheet1!A1) when linking sheets

### Formula Testing Strategy
- [ ] **Start small**: Test formulas on 2-3 cells before applying broadly
- [ ] **Verify dependencies**: Check all cells referenced by formulas exist
- [ ] **Test edge cases**: Include zero values, negative numbers, and very large values

### Interpreting recalc.py Output
The script returns JSON with error details:
```json
{
  "status": "success",           // or "errors_found"
  "total_errors": 0,              // total error count
  "total_formulas": 42,           // number of formulas in file
  "error_summary": {              // only present when errors found
    "#REF!": {
      "count": 2,
      "locations": ["Sheet1!B5", "Sheet1!C10"]
    }
  }
}
```

## Best Practices

### Library Selection
- **pandas**: Best for data analysis, bulk operations, and simple data export
- **openpyxl**: Best for complex formatting, formulas, and Excel-specific features

### Using openpyxl
- Cell indexing starts at 1 (row=1, column=1 refers to cell A1)
- Use `data_only=True` to read calculated values: `load_workbook('file.xlsx', data_only=True)`
- **Warning**: If opened with `data_only=True` and saved, formulas are replaced with values and permanently lost
- Large files: Use `read_only=True` for reading, `write_only=True` for writing
- Formulas are preserved but not evaluated -- use recalc.py to update values

### Using pandas
- Specify dtypes to avoid inference issues: `pd.read_excel('file.xlsx', dtype={'id': str})`
- Read specific columns for large files: `pd.read_excel('file.xlsx', usecols=['A', 'C', 'E'])`
- Handle dates properly: `pd.read_excel('file.xlsx', parse_dates=['date_column'])`

## Code Style Guide
**Important**: When generating Python code for Excel operations:
- Write minimal, concise Python code without unnecessary comments
- Avoid verbose variable names and redundant operations
- Avoid unnecessary print statements

**For Excel files themselves**:
- Add comments to cells with complex formulas or important assumptions
- Document data sources for hardcoded values
- Add notes to key calculations and model sections
