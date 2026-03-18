> Source: [K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills) | Category: Data Visualization

---
name: scientific-visualization
description: Meta-skill for creating publication-ready figures with multi-panel layouts, journal formatting, colorblind-safe palettes, and statistical rigor.
---

# Publication-Quality Scientific Visualization

## Overview

Scientific visualization transforms data into clear, accurate figures for publication. Create journal-ready plots with multi-panel layouts, error bars, significance markers, and colorblind-safe palettes. This skill orchestrates matplotlib, seaborn, and plotly with publication styles for manuscripts.

## When to Use

- Creating plots for scientific manuscripts
- Preparing figures for journal submission (Nature, Science, Cell, PLOS, etc.)
- Ensuring colorblind-friendly and accessible figures
- Making multi-panel figures with consistent styling
- Exporting figures at correct resolution and format
- Following specific publication guidelines

## Quick Start

### Basic Publication-Quality Figure

```python
import matplotlib.pyplot as plt
import numpy as np

# Create figure with appropriate size (single column = 3.5 inches)
fig, ax = plt.subplots(figsize=(3.5, 2.5))

x = np.linspace(0, 10, 100)
ax.plot(x, np.sin(x), label='sin(x)')
ax.plot(x, np.cos(x), label='cos(x)')

# Proper labeling with units
ax.set_xlabel('Time (seconds)')
ax.set_ylabel('Amplitude (mV)')
ax.legend(frameon=False)

# Remove unnecessary spines
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

# Save in publication formats
plt.savefig('figure1.pdf', bbox_inches='tight')
plt.savefig('figure1.png', dpi=300, bbox_inches='tight')
```

### With Seaborn

```python
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style='ticks', context='paper', font_scale=1.1)
sns.set_palette('colorblind')

fig, ax = plt.subplots(figsize=(3.5, 3))
sns.boxplot(data=df, x='treatment', y='response',
            order=['Control', 'Low', 'High'], palette='Set2', ax=ax)
sns.stripplot(data=df, x='treatment', y='response',
              order=['Control', 'Low', 'High'],
              color='black', alpha=0.3, size=3, ax=ax)
ax.set_ylabel('Response (uM)')
sns.despine()
```

## Core Principles

### 1. Resolution and File Format

| Image Type | Resolution | Recommended Format |
|------------|-----------|-------------------|
| Raster (photos, microscopy) | 300-600 DPI | TIFF, PNG |
| Line art (graphs, plots) | 600-1200 DPI or vector | PDF, EPS, SVG |
| Combination | 600 DPI | PDF |

Never use JPEG for scientific data plots -- it creates compression artifacts.

### 2. Colorblind-Safe Color Selection

**Recommended: Okabe-Ito palette** (distinguishable by all types of color blindness):

```python
okabe_ito = ['#E69F00', '#56B4E9', '#009E73', '#F0E442',
             '#0072B2', '#D55E00', '#CC79A7', '#000000']
plt.rcParams['axes.prop_cycle'] = plt.cycler(color=okabe_ito)
```

| Color | Hex Code |
|-------|----------|
| Orange | `#E69F00` |
| Sky Blue | `#56B4E9` |
| Bluish Green | `#009E73` |
| Yellow | `#F0E442` |
| Blue | `#0072B2` |
| Vermillion | `#D55E00` |
| Reddish Purple | `#CC79A7` |

**For heatmaps/continuous data:**
- Use perceptually uniform colormaps: `viridis`, `plasma`, `cividis`
- Avoid red-green diverging maps (use `PuOr`, `RdBu`, `BrBG` instead)
- Never use `jet` or `rainbow`

Always test figures in grayscale to ensure interpretability.

### 3. Typography

**Font guidelines:**
- Sans-serif fonts: Arial, Helvetica, Calibri
- Minimum sizes at **final print size**:
  - Axis labels: 7-9 pt
  - Tick labels: 6-8 pt
  - Panel labels: 8-12 pt (bold)
- Sentence case for labels: "Time (hours)" not "TIME (HOURS)"
- Always include units in parentheses

```python
import matplotlib as mpl
mpl.rcParams['font.family'] = 'sans-serif'
mpl.rcParams['font.sans-serif'] = ['Arial', 'Helvetica']
mpl.rcParams['font.size'] = 8
mpl.rcParams['axes.labelsize'] = 9
mpl.rcParams['xtick.labelsize'] = 7
mpl.rcParams['ytick.labelsize'] = 7
```

### 4. Journal-Specific Dimensions

| Journal | Single Column | Double Column | Max Height |
|---------|--------------|---------------|------------|
| **Nature** | 89 mm (3.5 in) | 183 mm (7.2 in) | 247 mm (9.7 in) |
| **Science** | 55 mm (2.17 in) | 175 mm (6.89 in) | 233 mm (9.17 in) |
| **Cell** | 85 mm (3.35 in) | 178 mm (7.01 in) | 230 mm (9.06 in) |

**Nature specifics:**
- Panel labels: a, b, c (lowercase, bold) in top-left corner
- Scale bars required for microscopy images
- Statistics: mark significance; define symbols in legend

**Science specifics:**
- Panel labels: (A), (B), (C) in parentheses
- Minimal text within figures (details in caption)
- Error bars required; define in caption

**Cell specifics:**
- Panel labels: A, B, C (uppercase, bold)
- Font 6-8 pt at final size

### 5. Multi-Panel Figures

**Best practices:**
- Label panels with bold letters: **A**, **B**, **C** (uppercase for most journals, lowercase for Nature)
- Maintain consistent styling across all panels
- Align panels along edges where possible
- Use adequate white space between panels

```python
from string import ascii_uppercase

fig = plt.figure(figsize=(7, 4))
gs = fig.add_gridspec(2, 2, hspace=0.4, wspace=0.4)

ax1 = fig.add_subplot(gs[0, 0])
ax2 = fig.add_subplot(gs[0, 1])
ax3 = fig.add_subplot(gs[1, 0])
ax4 = fig.add_subplot(gs[1, 1])

# Add panel labels
for i, ax in enumerate([ax1, ax2, ax3, ax4]):
    ax.text(-0.15, 1.05, ascii_uppercase[i], transform=ax.transAxes,
            fontsize=10, fontweight='bold', va='top')
```

### Multi-Panel with Seaborn

**FacetGrid for automatic faceting:**
```python
g = sns.relplot(data=df, x='dose', y='response',
                hue='treatment', col='cell_line', row='timepoint',
                kind='line', height=2.5, aspect=1.2,
                errorbar=('ci', 95), markers=True)
g.set_axis_labels('Dose (uM)', 'Response (AU)')
g.set_titles('{row_name} | {col_name}')
sns.despine()
```

**Seaborn with matplotlib subplots:**
```python
fig, axes = plt.subplots(2, 2, figsize=(7, 6))

sns.regplot(data=df, x='predictor', y='response', ax=axes[0, 0])
axes[0, 0].text(-0.15, 1.05, 'A', transform=axes[0, 0].transAxes,
                fontsize=10, fontweight='bold')

sns.violinplot(data=df, x='group', y='value', ax=axes[0, 1])
axes[0, 1].text(-0.15, 1.05, 'B', transform=axes[0, 1].transAxes,
                fontsize=10, fontweight='bold')

sns.heatmap(correlation_data, cmap='viridis', ax=axes[1, 0])
axes[1, 0].text(-0.15, 1.05, 'C', transform=axes[1, 0].transAxes,
                fontsize=10, fontweight='bold')

sns.lineplot(data=timeseries, x='time', y='signal',
             hue='condition', ax=axes[1, 1])
axes[1, 1].text(-0.15, 1.05, 'D', transform=axes[1, 1].transAxes,
                fontsize=10, fontweight='bold')

plt.tight_layout()
sns.despine()
```

## Statistical Rigor

**Always include:**
- Error bars (SD, SEM, or CI -- specify which in caption)
- Sample size (n) in figure or caption
- Statistical significance markers (*, **, ***)
- Individual data points when possible (not just summary statistics)

```python
# Show individual points with summary statistics
ax.scatter(x_jittered, individual_points, alpha=0.4, s=8)
ax.errorbar(x, means, yerr=sems, fmt='o', capsize=3)

# Mark significance
ax.text(1.5, max_y * 1.1, '***', ha='center', fontsize=8)
```

**Seaborn automatic uncertainty:**
```python
# Line plot: shows mean +/- 95% CI by default
sns.lineplot(data=df, x='time', y='value', hue='treatment',
             errorbar=('ci', 95))

# Bar plot: bootstrapped CI
sns.barplot(data=df, x='treatment', y='response',
            errorbar=('ci', 95), capsize=0.1)
```

## Plotly for Publication Export

```python
fig.update_layout(
    font=dict(family='Arial, sans-serif', size=10),
    plot_bgcolor='white',
)
fig.write_image('figure.png', scale=3)  # scale=3 gives ~300 DPI
```

## Workflow Summary

1. **Plan**: Determine target journal, figure type, and content
2. **Configure**: Apply appropriate style for journal
3. **Create**: Build figure with proper labels, colors, statistics
4. **Verify**: Check size, fonts, colors, accessibility
5. **Export**: Save in required formats
6. **Review**: View at final size in manuscript context

## Submission Checklist

- [ ] Resolution meets journal requirements (300+ DPI)
- [ ] File format is correct (vector for plots, TIFF for images)
- [ ] Figure size matches journal specifications
- [ ] All text readable at final size (>=6 pt)
- [ ] Colors are colorblind-friendly
- [ ] Figure works in grayscale
- [ ] All axes labeled with units
- [ ] Error bars present with definition in caption
- [ ] Panel labels present and consistent
- [ ] No chart junk or 3D effects
- [ ] Fonts consistent across all figures
- [ ] Statistical significance clearly marked
- [ ] Legend is clear and complete

## Common Pitfalls

| Pitfall | Description |
|---------|-------------|
| Font too small | Text unreadable at final print size |
| JPEG format | Never use JPEG for graphs/plots (creates artifacts) |
| Red-green colors | ~8% of males cannot distinguish red-green |
| Low resolution | Pixelated figures in publication |
| Missing units | Always label axes with units |
| 3D effects | Distorts perception, avoid completely |
| Truncated axes | Start bar charts at zero unless scientifically justified |
| Inconsistent styling | Different fonts/colors across figures in same manuscript |
| No error bars | Always show uncertainty |
