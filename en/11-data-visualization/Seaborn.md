> Source: [K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills) | Category: Data Visualization

---
name: seaborn
description: Statistical visualization library with pandas integration for distribution, relationship, and categorical plots with attractive defaults.
---

# Seaborn Statistical Visualization

## Overview

Seaborn is a Python visualization library for creating publication-quality statistical graphics. Built on matplotlib, it provides a dataset-oriented interface for multivariate analysis, automatic statistical estimation, and complex multi-panel figures with minimal code.

## Design Philosophy

1. **Dataset-oriented**: Work directly with DataFrames and named variables
2. **Semantic mapping**: Automatically translate data values into visual properties (colors, sizes, styles)
3. **Statistical awareness**: Built-in aggregation, error estimation, and confidence intervals
4. **Aesthetic defaults**: Publication-ready themes and color palettes out of the box
5. **Matplotlib integration**: Full compatibility with matplotlib customization

## Quick Start

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd

df = sns.load_dataset('tips')
sns.scatterplot(data=df, x='total_bill', y='tip', hue='day')
plt.show()
```

## Plotting Interfaces

### Function Interface (Traditional)

Specialized plotting functions organized by visualization type. Each category has **axes-level** functions (plot to single axes) and **figure-level** functions (manage entire figure with faceting).

### Objects Interface (Modern)

The `seaborn.objects` interface provides a declarative, composable API similar to ggplot2:

```python
from seaborn import objects as so

(
    so.Plot(data=df, x='total_bill', y='tip')
    .add(so.Dot(), color='day')
    .add(so.Line(), so.PolyFit())
)
```

## Plotting Functions by Category

### Relational Plots

**Use for:** Exploring relationships between two or more variables.

- `scatterplot()` -- Individual observations as points
- `lineplot()` -- Trends with automatic aggregation and CI
- `relplot()` -- Figure-level with automatic faceting

**Key parameters:** `x`, `y`, `hue`, `size`, `style`, `col`, `row`

```python
sns.scatterplot(data=df, x='total_bill', y='tip',
                hue='time', size='size', style='sex')

sns.lineplot(data=timeseries, x='date', y='value', hue='category')

sns.relplot(data=df, x='total_bill', y='tip',
            col='time', row='sex', hue='smoker', kind='scatter')
```

### Distribution Plots

**Use for:** Understanding data spread, shape, and probability density.

- `histplot()` -- Bar-based frequency distributions
- `kdeplot()` -- Smooth density estimates (Gaussian kernels)
- `ecdfplot()` -- Empirical cumulative distribution
- `rugplot()` -- Individual observation tick marks
- `displot()` -- Figure-level distribution interface
- `jointplot()` -- Bivariate plot with marginal distributions
- `pairplot()` -- Matrix of pairwise relationships

**Key parameters:** `stat` (count, frequency, probability, density), `bins`/`binwidth`, `bw_adjust`, `fill`, `multiple` (layer, stack, dodge, fill)

```python
sns.histplot(data=df, x='total_bill', hue='time',
             stat='density', multiple='stack')

sns.kdeplot(data=df, x='total_bill', y='tip',
            fill=True, levels=5, thresh=0.1)

sns.jointplot(data=df, x='total_bill', y='tip', kind='scatter', hue='time')

sns.pairplot(data=df, hue='species', corner=True)
```

### Categorical Plots

**Use for:** Comparing distributions or statistics across discrete categories.

**Categorical scatterplots:**
- `stripplot()` -- Points with jitter
- `swarmplot()` -- Non-overlapping points (beeswarm algorithm)

**Distribution comparisons:**
- `boxplot()` -- Quartiles and outliers
- `violinplot()` -- KDE + quartile information
- `boxenplot()` -- Enhanced boxplot for larger datasets

**Statistical estimates:**
- `barplot()` -- Mean/aggregate with confidence intervals
- `pointplot()` -- Point estimates with connecting lines
- `countplot()` -- Count of observations per category

**Figure-level:** `catplot()` (set `kind` parameter)

```python
sns.swarmplot(data=df, x='day', y='total_bill', hue='sex')

sns.violinplot(data=df, x='day', y='total_bill', hue='sex', split=True)

sns.barplot(data=df, x='day', y='total_bill',
            hue='sex', estimator='mean', errorbar='ci')

sns.catplot(data=df, x='day', y='total_bill', col='time', kind='box')
```

### Regression Plots

- `regplot()` -- Axes-level regression (scatter + fit line)
- `lmplot()` -- Figure-level with faceting
- `residplot()` -- Residual plot for model assessment

```python
sns.regplot(data=df, x='total_bill', y='tip')
sns.lmplot(data=df, x='total_bill', y='tip', col='time', order=2, ci=95)
```

### Matrix Plots

- `heatmap()` -- Color-encoded matrix with annotations
- `clustermap()` -- Hierarchically-clustered heatmap

```python
corr = df.corr()
sns.heatmap(corr, annot=True, fmt='.2f', cmap='coolwarm', center=0, square=True)

sns.clustermap(data, cmap='viridis', standard_scale=1, figsize=(10, 10))
```

## Figure-Level vs Axes-Level Functions

### Axes-Level Functions

- Plot to a single matplotlib `Axes` object
- Accept `ax=` parameter for precise placement
- Return `Axes` object
- Examples: `scatterplot`, `histplot`, `boxplot`, `regplot`, `heatmap`

```python
fig, axes = plt.subplots(2, 2, figsize=(10, 10))
sns.scatterplot(data=df, x='x', y='y', ax=axes[0, 0])
sns.histplot(data=df, x='x', ax=axes[0, 1])
sns.boxplot(data=df, x='cat', y='y', ax=axes[1, 0])
sns.kdeplot(data=df, x='x', y='y', ax=axes[1, 1])
```

### Figure-Level Functions

- Manage entire figure including all subplots
- Built-in faceting via `col` and `row` parameters
- Return `FacetGrid`, `JointGrid`, or `PairGrid` objects
- Use `height` and `aspect` for sizing
- Examples: `relplot`, `displot`, `catplot`, `lmplot`, `jointplot`, `pairplot`

```python
sns.relplot(data=df, x='x', y='y', col='category', row='group',
            hue='type', height=3, aspect=1.2)
```

## Multi-Plot Grids

### FacetGrid
```python
g = sns.FacetGrid(df, col='time', row='sex', hue='smoker')
g.map(sns.scatterplot, 'total_bill', 'tip')
g.add_legend()
```

### PairGrid
```python
g = sns.PairGrid(df, hue='species')
g.map_upper(sns.scatterplot)
g.map_lower(sns.kdeplot)
g.map_diag(sns.histplot)
g.add_legend()
```

### JointGrid
```python
g = sns.JointGrid(data=df, x='total_bill', y='tip')
g.plot_joint(sns.scatterplot)
g.plot_marginals(sns.histplot)
```

## Data Structure Requirements

### Long-Form Data (Preferred)

Each variable is a column, each observation is a row ("tidy" format):
```
   subject  condition  measurement
0        1    control         10.5
1        1  treatment         12.3
```

### Wide-Form Data

Variables spread across columns. Useful for simple rectangular data.

**Converting wide to long:**
```python
df_long = df.melt(var_name='condition', value_name='measurement')
```

## Color Palettes

### Qualitative (Categorical Data)
- `"deep"` -- Default, vivid
- `"muted"` -- Softer
- `"colorblind"` -- Color vision safe
- `"bright"`, `"dark"`, `"pastel"`

### Sequential (Ordered Data)
- `"rocket"`, `"mako"` -- Wide luminance range (heatmaps)
- `"flare"`, `"crest"` -- Restricted luminance (points/lines)
- `"viridis"`, `"magma"`, `"plasma"` -- Perceptually uniform

### Diverging (Centered Data)
- `"vlag"` -- Blue to red
- `"icefire"` -- Blue to orange
- `"coolwarm"`, `"Spectral"`

```python
sns.set_palette("colorblind")
custom = sns.color_palette("husl", 8)
palette = sns.light_palette("seagreen", as_cmap=True)
palette = sns.diverging_palette(250, 10, as_cmap=True)
```

## Theming and Aesthetics

### Styles
- `"darkgrid"` -- Gray background with white grid (default)
- `"whitegrid"` -- White background with gray grid
- `"dark"` -- Gray background, no grid
- `"white"` -- White background, no grid
- `"ticks"` -- White background with axis ticks

### Contexts (Scaling)
- `"paper"` -- Smallest (default)
- `"notebook"` -- Slightly larger
- `"talk"` -- Presentation slides
- `"poster"` -- Large format

```python
sns.set_theme(style='whitegrid', palette='pastel', font='sans-serif')
sns.set_context("talk", font_scale=1.2)
sns.despine(left=False, bottom=False, offset=10, trim=True)
```

## Best Practices

### 1. Data Preparation
Always use well-structured DataFrames with meaningful column names:
```python
df = pd.DataFrame({'bill': bills, 'tip': tips, 'day': days})
sns.scatterplot(data=df, x='bill', y='tip', hue='day')
```

### 2. Choose the Right Plot Type

| Data Type | Recommended |
|-----------|-------------|
| Continuous x + continuous y | `scatterplot`, `lineplot`, `kdeplot`, `regplot` |
| Continuous + categorical | `violinplot`, `boxplot`, `stripplot`, `swarmplot` |
| One continuous variable | `histplot`, `kdeplot`, `ecdfplot` |
| Correlations/matrices | `heatmap`, `clustermap` |
| Pairwise relationships | `pairplot`, `jointplot` |

### 3. Leverage Semantic Mappings
```python
sns.scatterplot(data=df, x='x', y='y',
                hue='category', size='importance', style='type')
```

### 4. Control Statistical Estimation
```python
sns.lineplot(data=df, x='time', y='value', errorbar='sd')
sns.barplot(data=df, x='category', y='value',
            estimator='median', errorbar=('ci', 95))
```

### 5. Combine with Matplotlib
```python
ax = sns.scatterplot(data=df, x='x', y='y')
ax.set(xlabel='Custom X Label', ylabel='Custom Y Label', title='Custom Title')
ax.axhline(y=0, color='r', linestyle='--')
plt.tight_layout()
```

### 6. Save High-Quality Figures
```python
fig = sns.relplot(data=df, x='x', y='y', col='group')
fig.savefig('figure.png', dpi=300, bbox_inches='tight')
fig.savefig('figure.pdf')  # Vector format for publications
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Legend outside plot area | `g._legend.set_bbox_to_anchor((0.9, 0.5))` |
| Overlapping labels | `plt.xticks(rotation=45, ha='right'); plt.tight_layout()` |
| Figure too small (figure-level) | `sns.relplot(..., height=6, aspect=1.5)` |
| Figure too small (axes-level) | `fig, ax = plt.subplots(figsize=(10, 6))` |
| Colors not distinct | `sns.set_palette("bright")` |
| KDE too smooth/jagged | Adjust `bw_adjust`: 0.5 (sharper) / 2 (smoother) |
