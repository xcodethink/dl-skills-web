> Source: [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | Category: G-Tools-and-Productivity

---
name: chrome-devtools
description: Automate browser tasks via executable Puppeteer scripts with JSON output for navigation, screenshots, form filling, and performance analysis
---

# Chrome DevTools Agent Skill

## Overview

Automate browser tasks via executable Puppeteer scripts. All scripts output JSON for easy parsing. Supports navigation, screenshots, form automation, element interaction, console monitoring, network tracking, and Core Web Vitals performance measurement.

## Quick Start

**Key Tip**: Always check `pwd` before running scripts.

### Installation

#### Step 1: Install System Dependencies (Linux/WSL Only)

On Linux/WSL, Chrome requires system libraries. Install them first:

```bash
pwd  # Should show current working directory
cd .claude/skills/chrome-devtools/scripts
./install-deps.sh  # Auto-detects OS and installs required libraries
```

Supported: Ubuntu, Debian, Fedora, RHEL, CentOS, Arch, Manjaro

**macOS/Windows**: Skip this step (dependencies bundled with Chrome)

#### Step 2: Install Node Dependencies

```bash
npm install  # Installs puppeteer, debug, yargs
```

#### Step 3: Install ImageMagick (Optional, Recommended)

ImageMagick enables automatic compression of screenshots exceeding 5MB:

**macOS:**
```bash
brew install imagemagick
```

**Ubuntu/Debian/WSL:**
```bash
sudo apt-get install imagemagick
```

**Verify:**
```bash
magick -version  # Or: convert -version
```

Without ImageMagick, screenshots exceeding 5MB will not be compressed (may fail to load in Gemini/Claude).

### Test
```bash
node navigate.js --url https://example.com
# Output: {"success": true, "url": "https://example.com", "title": "Example Domain"}
```

## Available Scripts

All scripts located in `.claude/skills/chrome-devtools/scripts/`

**Key Tip**: Always check `pwd` before running scripts.

### Script Usage
- `./scripts/README.md`

### Core Automation
- `navigate.js` - Navigate to URL
- `screenshot.js` - Capture screenshots (full-page or element)
- `click.js` - Click elements
- `fill.js` - Fill form fields
- `evaluate.js` - Execute JavaScript in page context

### Analysis and Monitoring
- `snapshot.js` - Extract interactive elements with metadata
- `console.js` - Monitor console messages/errors
- `network.js` - Track HTTP requests/responses
- `performance.js` - Measure Core Web Vitals + record traces

## Usage Patterns

### Single Command
```bash
pwd  # Should show current working directory
cd .claude/skills/chrome-devtools/scripts
node screenshot.js --url https://example.com --output ./docs/screenshots/page.png
```
**Important**: Always save screenshots to the `./docs/screenshots` directory.

### Automatic Image Compression
If a screenshot exceeds 5MB, it is **automatically compressed** for compatibility with Gemini API and Claude Code (both have 5MB limits). Internally uses ImageMagick:

```bash
# Default: auto-compress above 5MB
node screenshot.js --url https://example.com --output page.png

# Custom size threshold (e.g., 3MB)
node screenshot.js --url https://example.com --output page.png --max-size 3

# Disable compression
node screenshot.js --url https://example.com --output page.png --no-compress
```

**Compression behavior:**
- PNG: Scale to 90% + quality 85 (if still too large: 75% + quality 70)
- JPEG: Quality 80 + progressive encoding (if still too large: quality 60)
- Other formats: Convert to JPEG and compress
- Requires ImageMagick installed (see imagemagick skill)

**Output includes compression info:**
```json
{
  "success": true,
  "output": "/path/to/page.png",
  "compressed": true,
  "originalSize": 8388608,
  "size": 3145728,
  "compressionRatio": "62.50%",
  "url": "https://example.com"
}
```

### Chained Commands (Browser Reuse)
```bash
# Use --close false to keep browser open
node navigate.js --url https://example.com/login --close false
node fill.js --selector "#email" --value "user@example.com" --close false
node fill.js --selector "#password" --value "secret" --close false
node click.js --selector "button[type=submit]"
```

### Parsing JSON Output
```bash
# Extract specific fields with jq
node performance.js --url https://example.com | jq '.vitals.LCP'

# Save to file
node network.js --url https://example.com --output /tmp/requests.json
```

## Execution Protocol

### Working Directory Verification

**Before** executing any script:
1. Check current working directory with `pwd`
2. Confirm you are in the `.claude/skills/chrome-devtools/scripts/` directory
3. If in the wrong directory, `cd` to the correct location
4. Use absolute paths for all output files

Example:
```bash
pwd  # Should show: .../chrome-devtools/scripts
# If wrong directory:
cd .claude/skills/chrome-devtools/scripts
```

### Output Verification

**After** screenshot/capture operations:
1. Verify file created with `ls -lh <output-path>`
2. Use the Read tool to read the screenshot and confirm content
3. Check JSON output for success:true
4. Report file size and compression status

Example:
```bash
node screenshot.js --url https://example.com --output ./docs/screenshots/page.png
ls -lh ./docs/screenshots/page.png  # Verify file exists
# Then use Read tool for visual inspection
```

5. Reset working directory to project root.

### Error Recovery

When a script fails:
1. Check the error message for selector issues
2. Use snapshot.js to discover correct selectors
3. Try XPath selectors if CSS selectors fail
4. Verify elements are visible and interactable

Example:
```bash
# CSS selector fails
node click.js --url https://example.com --selector ".btn-submit"
# Error: Waiting for selector ".btn-submit" failed

# Discover correct selector
node snapshot.js --url https://example.com | jq '.elements[] | select(.tagName=="BUTTON")'

# Try XPath
node click.js --url https://example.com --selector "//button[contains(text(),'Submit')]"
```

### Common Mistakes

- Wrong working directory -> output files in wrong location
- Skipping output verification -> silent failures
- Using complex CSS selectors without testing -> selector errors
- Not checking element visibility -> timeout errors

Correct approach:
- Always verify `pwd` before running scripts
- Always verify output after screenshots
- Use snapshot.js to discover selectors
- Test selectors with simple commands first

## Common Workflows

### Web Scraping
```bash
node evaluate.js --url https://example.com --script "
  Array.from(document.querySelectorAll('.item')).map(el => ({
    title: el.querySelector('h2')?.textContent,
    link: el.querySelector('a')?.href
  }))
" | jq '.result'
```

### Performance Testing
```bash
PERF=$(node performance.js --url https://example.com)
LCP=$(echo $PERF | jq '.vitals.LCP')
if (( $(echo "$LCP < 2500" | bc -l) )); then
  echo "LCP passed: ${LCP}ms"
else
  echo "LCP failed: ${LCP}ms"
fi
```

### Form Automation
```bash
node fill.js --url https://example.com --selector "#search" --value "query" --close false
node click.js --selector "button[type=submit]"
```

### Error Monitoring
```bash
node console.js --url https://example.com --types error,warn --duration 5000 | jq '.messageCount'
```

## Script Options

All scripts support:
- `--headless false` - Show browser window
- `--close false` - Keep browser open for chaining
- `--timeout 30000` - Set timeout (milliseconds)
- `--wait-until networkidle2` - Wait strategy

See `./scripts/README.md` for complete options.

## Output Format

All scripts output JSON to stdout:
```json
{
  "success": true,
  "url": "https://example.com",
  ... // Script-specific data
}
```

Errors output to stderr:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Finding Elements

Use `snapshot.js` to discover selectors:
```bash
node snapshot.js --url https://example.com | jq '.elements[] | {tagName, text, selector}'
```

## Troubleshooting

### Common Errors

**"Cannot find package 'puppeteer'"**
- Run: `npm install` in the scripts directory

**"error while loading shared libraries: libnss3.so"** (Linux/WSL)
- Missing system dependencies
- Fix: Run `./install-deps.sh` in the scripts directory
- Manual: `sudo apt-get install -y libnss3 libnspr4 libasound2t64 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1`

**"Failed to launch the browser process"**
- Check system dependencies are installed (Linux/WSL)
- Verify Chrome is downloaded: `ls ~/.cache/puppeteer`
- Try: `npm rebuild` then `npm install`

**Chrome not found**
- Puppeteer downloads Chrome automatically during `npm install`
- If it fails, trigger manually: `npx puppeteer browsers install chrome`

### Script Issues

**Element not found**
- Get a snapshot first to find the correct selector: `node snapshot.js --url <url>`

**Script hangs**
- Increase timeout: `--timeout 60000`
- Change wait strategy: `--wait-until load` or `--wait-until domcontentloaded`

**Blank screenshot**
- Wait for page load: `--wait-until networkidle2`
- Increase timeout: `--timeout 30000`

**Script permission denied**
- Add execute permission: `chmod +x *.sh`

**Screenshot too large (>5MB)**
- Install ImageMagick for automatic compression
- Set a lower threshold manually: `--max-size 3`
- Use JPEG format instead of PNG: `--format jpeg --quality 80`
- Capture specific elements instead of full page: `--selector .main-content`

**Compression not working**
- Verify ImageMagick is installed: `magick -version` or `convert -version`
- Check output JSON for file compression status: `"compressed": true`
- For very large pages, use `--selector` to capture only the needed region

## Reference Documentation

Detailed guides in `./references/`:
- [CDP Domain Reference](./references/cdp-domains.md) - 47 Chrome DevTools Protocol domains
- [Puppeteer Quick Reference](./references/puppeteer-reference.md) - Complete Puppeteer API patterns
- [Performance Analysis Guide](./references/performance-guide.md) - Core Web Vitals optimization

## Advanced Usage

### Custom Scripts
Create custom scripts using the shared library:
```javascript
import { getBrowser, getPage, closeBrowser, outputJSON } from './lib/browser.js';
// Your automation logic
```

### Direct CDP Access
```javascript
const client = await page.createCDPSession();
await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
```

See reference documentation for advanced patterns and full API coverage.

## External Resources

- [Puppeteer Documentation](https://pptr.dev/)
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)
- [Scripts README](./scripts/README.md)
