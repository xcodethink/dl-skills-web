> Source: [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Category: Design & Content

---
name: image-enhancer
description: Triggers when improving image quality -- enhances resolution, sharpness, and clarity of images and screenshots for presentations, documentation, social media, or print.
---

# Image Enhancer

## Overview

This skill takes images and screenshots and makes them sharper, clearer, and more professional. It analyzes current image quality, applies targeted enhancements (upscaling, sharpening, artifact reduction), and optimizes output for the intended use case -- whether web, print, or social media.

## When to Use

- Improving screenshot quality for blog posts or documentation
- Enhancing images before sharing on social media
- Preparing images for presentations or reports
- Upscaling low-resolution images
- Sharpening blurry photos
- Cleaning up compressed images with visible artifacts

## What It Does

1. **Analyzes Image Quality** -- Checks resolution, sharpness, and compression artifacts
2. **Enhances Resolution** -- Upscales images intelligently
3. **Improves Sharpness** -- Enhances edges and details
4. **Reduces Artifacts** -- Cleans up compression artifacts and noise
5. **Optimizes for Use Case** -- Adjusts based on intended use (web, print, social media)

## How to Use

### Basic Enhancement

```
Improve the image quality of screenshot.png
```

```
Enhance all images in this folder
```

### Specific Improvements

```
Upscale this image to 4K resolution
```

```
Sharpen this blurry screenshot
```

```
Reduce compression artifacts in this image
```

### Batch Processing

```
Improve the quality of all PNG files in this directory
```

## Example

**Input**: `screenshot-2024.png`

```
Analyzing screenshot-2024.png...

Current specs:
- Resolution: 1920x1080
- Format: PNG
- Quality: Good, but slight blur

Enhancements applied:
  Upscaled to 2560x1440 (retina)
  Sharpened edges
  Enhanced text clarity
  Optimized file size

Saved as: screenshot-2024-enhanced.png
Original preserved as: screenshot-2024-original.png
```

## Tips

- Original files are always preserved as backups
- Works best with screenshots and digital images
- Can batch process entire folders
- Specify output format if needed (PNG for quality, JPG for smaller size)
- For social media, mention the target platform for optimal sizing

## Common Use Cases

| Context | What It Does |
|---|---|
| **Blog Posts** | Enhance screenshots before publishing |
| **Documentation** | Make UI screenshots crystal clear |
| **Social Media** | Optimize images for Twitter, LinkedIn, Instagram |
| **Presentations** | Upscale images for large screens |
| **Print Materials** | Increase resolution for physical media |
