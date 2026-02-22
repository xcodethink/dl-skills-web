> Source: [K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills) | Category: Data Visualization

---
name: matplotlib
description: Python's foundational plotting library for creating static, animated, and interactive visualizations with full customization control.
---

# Matplotlib

## Overview

Matplotlib is Python's foundational visualization library. It provides two interfaces: the pyplot interface (MATLAB-style) and the object-oriented API (Figure/Axes). Use it when you need fine-grained control over every plot element, novel plot types, or integration with specific scientific workflows. Export to PNG/PDF/SVG for publication.

## Core Concepts

### The Matplotlib Hierarchy

1. **Figure** -- Top-level container for all plot elements
2. **Axes** -- The actual plotting area (one Figure can contain multiple Axes)
3. **Artist** -- Everything visible on the figure (lines, text, ticks, etc.)
4. **Axis** -- The number line objects (x-axis, y-axis) handling ticks and labels

### Two Interfaces

**1. pyplot Interface (Implicit, MATLAB-style)**
```python
import matplotlib.pyplot as plt

plt.plot([1, 2, 3, 4])
plt.ylabel('some numbers')
plt.show()
```
- Convenient for quick, simple plots
- Maintains state automatically
- Good for interactive work and simple scripts

**2. Object-Oriented Interface (Explicit) -- Recommended**
```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3, 4])
ax.set_ylabel('some numbers')
plt.show()
```
- **Recommended for most use cases**
- More explicit control over figure and axes
- Better for complex figures with multiple subplots
- Easier to maintain and debug

## Common Workflows

### 1. Basic Plot Creation

```python
import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots(figsize=(10, 6))

x = np.linspace(0, 2*np.pi, 100)
ax.plot(x, np.sin(x), label='sin(x)')
ax.plot(x, np.cos(x), label='cos(x)')

ax.set_xlabel('x')
ax.set_ylabel('y')
ax.set_title('Trigonometric Functions')
ax.legend()
ax.grid(True, alpha=0.3)

plt.savefig('plot.png', dpi=300, bbox_inches='tight')
plt.show()
```

### 2. Multiple Subplots

```python
# Method 1: Regular grid
fig, axes = plt.subplots(2, 2, figsize=(12, 10))
axes[0, 0].plot(x, y1)
axes[0, 1].scatter(x, y2)
axes[1, 0].bar(categories, values)
axes[1, 1].hist(data, bins=30)

# Method 2: Mosaic layout (more flexible)
fig, axes = plt.subplot_mosaic([['left', 'right_top'],
                                 ['left', 'right_bottom']],
                                figsize=(10, 8))
axes['left'].plot(x, y)
axes['right_top'].scatter(x, y)
axes['right_bottom'].hist(data)

# Method 3: GridSpec (maximum control)
from matplotlib.gridspec import GridSpec
fig = plt.figure(figsize=(12, 8))
gs = GridSpec(3, 3, figure=fig)
ax1 = fig.add_subplot(gs[0, :])    # Top row, all columns
ax2 = fig.add_subplot(gs[1:, 0])   # Bottom two rows, first column
ax3 = fig.add_subplot(gs[1:, 1:])  # Bottom two rows, last two columns
```

### 3. Plot Types

| Type | Use Case | Example |
|------|----------|---------|
| Line plot | Time series, trends | `ax.plot(x, y, linewidth=2, linestyle='--', marker='o')` |
| Scatter plot | Variable relationships | `ax.scatter(x, y, s=sizes, c=colors, alpha=0.6, cmap='viridis')` |
| Bar chart | Categorical comparisons | `ax.bar(categories, values, color='steelblue', edgecolor='black')` |
| Histogram | Distributions | `ax.hist(data, bins=30, edgecolor='black', alpha=0.7)` |
| Heatmap | Matrix data, correlations | `ax.imshow(matrix, cmap='coolwarm', aspect='auto')` |
| Contour | 3D data on 2D plane | `ax.contour(X, Y, Z, levels=10)` |
| Box plot | Statistical distributions | `ax.boxplot([data1, data2, data3], labels=['A', 'B', 'C'])` |
| Violin plot | Distribution densities | `ax.violinplot([data1, data2, data3], positions=[1, 2, 3])` |

### 4. Styling and Customization

**Color specification methods:**
- Named colors: `'red'`, `'blue'`, `'steelblue'`
- Hex codes: `'#FF5733'`
- RGB tuples: `(0.1, 0.2, 0.3)`
- Colormaps: `cmap='viridis'`, `cmap='plasma'`, `cmap='coolwarm'`

**Style sheets:**
```python
plt.style.use('seaborn-v0_8-darkgrid')
print(plt.style.available)  # List all available styles
```

**rcParams customization:**
```python
plt.rcParams['font.size'] = 12
plt.rcParams['axes.labelsize'] = 14
plt.rcParams['axes.titlesize'] = 16
plt.rcParams['xtick.labelsize'] = 10
plt.rcParams['ytick.labelsize'] = 10
plt.rcParams['legend.fontsize'] = 12
```

**Text and annotations:**
```python
ax.text(x, y, 'annotation', fontsize=12, ha='center')
ax.annotate('important point', xy=(x, y), xytext=(x+1, y+1),
            arrowprops=dict(arrowstyle='->', color='red'))
```

### 5. Saving Figures

```python
# High-resolution PNG for presentations/papers
plt.savefig('figure.png', dpi=300, bbox_inches='tight', facecolor='white')

# Vector format for publications (scalable)
plt.savefig('figure.pdf', bbox_inches='tight')
plt.savefig('figure.svg', bbox_inches='tight')

# Transparent background
plt.savefig('figure.png', dpi=300, bbox_inches='tight', transparent=True)
```

**Key parameters:**
| Parameter | Description |
|-----------|-------------|
| `dpi` | Resolution: 300 (publications), 150 (web), 72 (screen) |
| `bbox_inches='tight'` | Removes excess whitespace |
| `facecolor='white'` | Ensures white background |
| `transparent=True` | Transparent background |

### 6. 3D Plots

```python
from mpl_toolkits.mplot3d import Axes3D

fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111, projection='3d')

ax.plot_surface(X, Y, Z, cmap='viridis')
ax.scatter(x, y, z, c=colors, marker='o')

ax.set_xlabel('X Label')
ax.set_ylabel('Y Label')
ax.set_zlabel('Z Label')
```

## Best Practices

### Interface Selection
- Use the object-oriented interface (`fig, ax = plt.subplots()`) for production code
- Reserve pyplot interface for quick interactive exploration only
- Always create figures explicitly rather than relying on implicit state

### Figure Size and DPI
- Set figsize at creation: `fig, ax = plt.subplots(figsize=(10, 6))`
- Use appropriate DPI: screen 72-100, web 150, print/publications 300

### Layout Management
- Use `constrained_layout=True` or `tight_layout()` to prevent overlapping elements
- Recommended: `fig, ax = plt.subplots(constrained_layout=True)`

### Colormap Selection
| Type | Use Case | Recommended |
|------|----------|-------------|
| Sequential | Ordered data | viridis, plasma, inferno |
| Diverging | Data with meaningful center | coolwarm, RdBu |
| Qualitative | Categorical data | tab10, Set3 |

Avoid rainbow colormaps (jet) -- they are not perceptually uniform.

### Accessibility
- Use colorblind-friendly colormaps (viridis, cividis)
- Add hatching patterns for bar charts in addition to colors
- Ensure sufficient contrast between elements
- Include descriptive labels and legends

### Performance
- For large datasets, use `rasterized=True` to reduce file size
- Downsample dense data before plotting
- For animations, use blitting for better performance

### Code Organization

```python
def create_analysis_plot(data, title):
    """Create standardized analysis plot."""
    fig, ax = plt.subplots(figsize=(10, 6), constrained_layout=True)

    ax.plot(data['x'], data['y'], linewidth=2)

    ax.set_xlabel('X Axis Label', fontsize=12)
    ax.set_ylabel('Y Axis Label', fontsize=12)
    ax.set_title(title, fontsize=14, fontweight='bold')
    ax.grid(True, alpha=0.3)

    return fig, ax

fig, ax = create_analysis_plot(my_data, 'My Analysis')
plt.savefig('analysis.png', dpi=300, bbox_inches='tight')
```

## Common Gotchas

1. **Overlapping elements**: Use `constrained_layout=True` or `tight_layout()`
2. **State confusion**: Use OO interface to avoid pyplot state machine issues
3. **Memory leaks**: Close figures explicitly with `plt.close(fig)`
4. **Font warnings**: Install fonts or set `plt.rcParams['font.sans-serif']`
5. **DPI confusion**: figsize is in inches, not pixels: `pixels = dpi * inches`

## Integration

- **NumPy/Pandas** -- Direct plotting from arrays and DataFrames
- **Seaborn** -- High-level statistical visualizations built on matplotlib
- **Jupyter** -- Interactive plotting with `%matplotlib inline` or `%matplotlib widget`
- **GUI frameworks** -- Embedding in Tkinter, Qt, wxPython applications
