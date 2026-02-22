> Source: [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Category: Docs & Productivity

---
name: invoice-organizer
description: Automatically organizes invoices and receipts for tax preparation by reading files, extracting key information, renaming them consistently, and sorting into logical folders.
---

# Invoice Organizer

## Overview

This skill transforms chaotic folders of invoices, receipts, and financial documents into a clean, tax-ready filing system. It reads each file to extract vendor, date, amount, and description, then renames everything consistently and sorts into logical folders -- turning hours of manual bookkeeping into minutes of automated organization.

## When to Use

- Preparing for tax season and needing organized records
- Managing business expenses across multiple vendors
- Organizing receipts from a messy folder or email downloads
- Setting up automated invoice filing for ongoing bookkeeping
- Archiving financial records by year or category
- Reconciling expenses for reimbursement
- Preparing documentation for accountants

## What It Does

1. **Reads Invoice Content** -- Extracts vendor name, invoice number, date, amount, description, and payment method from PDFs, images, and documents
2. **Renames Files Consistently** -- Format: `YYYY-MM-DD Vendor - Invoice - ProductOrService.pdf`
3. **Organizes by Category** -- Sorts by vendor, expense category, time period, or tax category
4. **Handles Multiple Formats** -- Works with PDFs, scanned receipts (JPG, PNG), email attachments, screenshots, and bank statements
5. **Generates Summary CSV** -- Creates a spreadsheet with all invoice details for accounting software import

## How to Use

### Basic Usage

Navigate to your invoice folder and ask:

```
Organize these invoices for taxes
```

### Detailed Request

```
Read all invoices in this folder, rename them to
"YYYY-MM-DD Vendor - Invoice - Product.pdf" format,
and organize them by vendor
```

### Advanced Organization

```
Organize these invoices:
1. Extract date, vendor, and description from each file
2. Rename to standard format
3. Sort into folders by expense category (Software, Office, Travel, etc.)
4. Create a CSV spreadsheet with all invoice details for my accountant
```

## How It Works

### 1. Scan the Folder

Identifies all invoice-related files (PDFs, images) and reports:
- Total number of files
- File types found
- Date range (if discernible)
- Current organization state

### 2. Extract Information

**From PDF invoices** -- Looks for patterns:
- "Invoice Date:", "Date:", "Issued:"
- "Invoice #:", "Invoice Number:"
- Company name (usually at top)
- "Amount Due:", "Total:", "Amount:"
- "Description:", "Service:", "Product:"

**From image receipts** -- Reads visible text, identifies vendor, date, and total.

**Fallback** -- Uses filename clues and file modification date. Flags unclear files for manual review.

### 3. Determine Organization Strategy

```markdown
How would you like them organized?

1. **By Vendor** (Adobe/, Amazon/, Stripe/, etc.)
2. **By Category** (Software/, Office Supplies/, Travel/, etc.)
3. **By Date** (2024/Q1/, 2024/Q2/, etc.)
4. **By Tax Category** (Deductible/, Personal/, etc.)
5. **Custom** (describe your structure)

Or default: Year/Category/Vendor
```

### 4. Create Standardized Filenames

```
YYYY-MM-DD Vendor - Invoice - Description.ext
```

Examples:
- `2024-03-15 Adobe - Invoice - Creative Cloud.pdf`
- `2024-01-10 Amazon - Receipt - Office Supplies.pdf`
- `2023-12-01 Stripe - Invoice - Monthly Payment Processing.pdf`

### 5. Execute (After Approval)

Shows the plan first:

```markdown
## Sample Changes

Before: invoice_adobe_march.pdf
After:  2024-03-15 Adobe - Invoice - Creative Cloud.pdf
Location: Invoices/2024/Software/Adobe/

Before: IMG_2847.jpg
After:  2024-02-10 Staples - Receipt - Office Supplies.jpg
Location: Invoices/2024/Office/Staples/

Process [X] files? (yes/no)
```

### 6. Generate Summary Report

```csv
Date,Vendor,Invoice Number,Description,Amount,Category,File Path
2024-03-15,Adobe,INV-12345,Creative Cloud,52.99,Software,Invoices/2024/Software/Adobe/...
2024-03-10,Amazon,123-4567890,Office Supplies,127.45,Office,Invoices/2024/Office/Amazon/...
```

This CSV is useful for importing into accounting software, sharing with accountants, expense tracking, and tax preparation.

### 7. Completion Summary

```markdown
# Organization Complete

## Summary
- Processed: [X] invoices
- Date range: [earliest] to [latest]
- Total amount: $[sum]
- Vendors: [Y] unique vendors

## Files Created
- /Invoices/ -- Organized invoices
- /Invoices/invoice-summary.csv -- Spreadsheet for accounting
- /Invoices/originals/ -- Original files (if copied)

## Files Needing Review
[List any files where information could not be extracted]
```

## Common Organization Patterns

### By Vendor (Simple)
```
Invoices/
├── Adobe/
├── Amazon/
├── Google/
└── Microsoft/
```

### By Year and Category (Tax-Friendly)
```
Invoices/
├── 2023/
│   ├── Software/
│   ├── Hardware/
│   ├── Services/
│   └── Travel/
└── 2024/
    └── ...
```

### By Quarter (Detailed Tracking)
```
Invoices/
├── 2024/
│   ├── Q1/
│   │   ├── Software/
│   │   ├── Office/
│   │   └── Travel/
│   └── Q2/
│       └── ...
```

### By Tax Category (Accountant-Ready)
```
Invoices/
├── Deductible/
│   ├── Software/
│   ├── Office/
│   └── Professional-Services/
├── Partially-Deductible/
│   └── Meals-Travel/
└── Personal/
```

## Handling Special Cases

### Missing Information
- Flag file for manual review
- Use file modification date as fallback
- Create "Needs-Review/" folder

### Duplicate Invoices
- Compare file hashes
- Keep highest quality version
- Note duplicates in summary

### Multi-Page Invoices
- Merge PDFs if needed
- Use consistent naming for parts
- Note in CSV if invoice is split

### Non-Standard Formats
- Extract what is possible
- Standardize what you can
- Flag for review if critical info is missing

## Pro Tips

1. **Scan emails to PDF** -- Save email invoices as PDFs first
2. **Consistent downloads** -- Save all invoices to one folder for batch processing
3. **Monthly routine** -- Organize invoices monthly, not annually
4. **Backup originals** -- Keep original files before reorganizing
5. **Include amounts in CSV** -- Useful for budget tracking
6. **Tag by deductibility** -- Note which expenses are tax-deductible
7. **Keep receipts 7 years** -- Standard audit retention period

## Automation

For ongoing organization:

```
Create a script that watches my ~/Downloads/invoices folder
and auto-organizes any new invoice files using our standard
naming and folder structure.
```
