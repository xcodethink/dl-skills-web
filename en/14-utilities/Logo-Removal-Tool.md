> Source: [bear2u/my-skills](https://github.com/bear2u/my-skills) | Category: F-Tools-and-Productivity

---
name: logo-removal-tool
description: Remove AI-generated logos and watermarks from images using OpenCV inpainting
---

# Logo Removal Tool (Gemini Logo Remover)

## Overview

Remove AI-generated logos and watermarks from images using OpenCV inpainting technology. Designed primarily for Gemini's star logo but works with any small watermark or logo on a relatively uniform background.

## Installation

```bash
pip install opencv-python numpy pillow --break-system-packages
```

## Usage

### Remove by Coordinates

```python
import cv2
import numpy as np

def remove_region(input_path, output_path, x1, y1, x2, y2, radius=5):
    """Remove a rectangular region using inpainting."""
    img = cv2.imread(input_path)
    h, w = img.shape[:2]

    mask = np.zeros((h, w), dtype=np.uint8)
    cv2.rectangle(mask, (x1, y1), (x2, y2), 255, -1)

    result = cv2.inpaint(img, mask, radius, cv2.INPAINT_TELEA)
    cv2.imwrite(output_path, result)

# Example: Remove region at specified coordinates
remove_region('/mnt/user-data/uploads/img.png',
              '/mnt/user-data/outputs/clean.png',
              x1=700, y1=650, x2=800, y2=720)
```

### Remove by Corner

```python
def remove_corner_logo(input_path, output_path, corner='bottom_right',
                       w_ratio=0.1, h_ratio=0.1, padding=10):
    """Remove a logo from a corner.
    corner: top_left, top_right, bottom_left, bottom_right"""
    img = cv2.imread(input_path)
    h, w = img.shape[:2]

    lw, lh = int(w * w_ratio), int(h * h_ratio)

    coords = {
        'bottom_right': (w - lw - padding, h - lh - padding, w - padding, h - padding),
        'bottom_left': (padding, h - lh - padding, lw + padding, h - padding),
        'top_right': (w - lw - padding, padding, w - padding, lh + padding),
        'top_left': (padding, padding, lw + padding, lh + padding)
    }
    x1, y1, x2, y2 = coords[corner]

    mask = np.zeros((h, w), dtype=np.uint8)
    cv2.rectangle(mask, (x1, y1), (x2, y2), 255, -1)

    result = cv2.inpaint(img, mask, 5, cv2.INPAINT_TELEA)
    cv2.imwrite(output_path, result)

# Example: Remove bottom-right logo
remove_corner_logo('/mnt/user-data/uploads/img.png',
                   '/mnt/user-data/outputs/no_logo.png',
                   corner='bottom_right', w_ratio=0.08, h_ratio=0.08)
```

### Finding Coordinates

```python
img = cv2.imread(input_path)
h, w = img.shape[:2]
print(f"Dimensions: {w}x{h}")

# Gemini star logo is typically in the bottom-right area
# Common coordinates: x1=w-150, y1=h-100, x2=w-130, y2=h-55
# Exact position varies by image -- adjust accordingly
```

## Output

Always save to `/mnt/user-data/outputs/` and use the `present_files` tool to display results.

## Notes

- Inpainting works best on small regions with uniform backgrounds
- Gemini logo is typically located in the bottom-right corner
- Adjust coordinates and ratios based on actual logo position and size
- The `INPAINT_TELEA` algorithm fills the masked region by propagating surrounding pixel information
- For complex backgrounds, results may require manual touch-up
