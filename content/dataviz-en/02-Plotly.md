> Source: [K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills) | Category: Data Visualization

---
name: plotly
description: Interactive visualization library for hover-enabled, zoomable, web-embeddable charts with 40+ chart types.
---

# Plotly

## Overview

Plotly is a Python graphing library for creating interactive, publication-quality visualizations with 40+ chart types. Use when you need hover info, zoom, pan, or web-embeddable charts. Best for dashboards, exploratory analysis, and presentations. For static publication figures, use matplotlib or scientific-visualization.

## Quick Start

```bash
pip install plotly
```

```python
import plotly.express as px
import pandas as pd

df = pd.DataFrame({'x': [1, 2, 3, 4], 'y': [10, 11, 12, 13]})
fig = px.scatter(df, x='x', y='y', title='My First Plot')
fig.show()
```

## Choosing Between APIs

### Plotly Express (px) -- High-Level API

Use for quick, standard visualizations with sensible defaults:
- Working with pandas DataFrames
- Creating common chart types (scatter, line, bar, histogram, etc.)
- Automatic color encoding and legends
- Minimal code (1-5 lines)

### Graph Objects (go) -- Low-Level API

Use for fine-grained control and custom visualizations:
- Chart types not in Plotly Express (3D mesh, isosurface, complex financial charts)
- Building complex multi-trace figures from scratch
- Precise control over individual components
- Specialized visualizations with custom shapes and annotations

**Plotly Express returns Graph Objects figures, so you can combine approaches:**
```python
fig = px.scatter(df, x='x', y='y')
fig.update_layout(title='Custom Title')  # Use go methods on px figure
fig.add_hline(y=10)                      # Add shapes
```

## Chart Types

| Category | Types |
|----------|-------|
| Basic | scatter, line, bar, pie, area, bubble |
| Statistical | histogram, box plot, violin, distribution, error bars |
| Scientific | heatmap, contour, ternary, image display |
| Financial | candlestick, OHLC, waterfall, funnel, time series |
| Maps | scatter maps, choropleth, density maps |
| 3D | scatter3d, surface, mesh, cone, volume |
| Specialized | sunburst, treemap, sankey, parallel coordinates, gauge |

## Core Capabilities

### 1. Layouts and Styling

**Subplots with shared axes:**
```python
from plotly.subplots import make_subplots
import plotly.graph_objects as go

fig = make_subplots(rows=2, cols=2, subplot_titles=('A', 'B', 'C', 'D'))
fig.add_trace(go.Scatter(x=[1, 2], y=[3, 4]), row=1, col=1)
```

**Templates for coordinated styling:**
```python
fig = px.scatter(df, x='x', y='y', template='plotly_dark')
# Built-in: plotly_white, plotly_dark, ggplot2, seaborn, simple_white
```

**Customization options:** colors (discrete sequences, continuous scales), fonts, axes (ranges, ticks, grids), legends, margins, annotations, and shapes.

### 2. Interactivity

Built-in interactive features:
- Hover tooltips with customizable data
- Pan and zoom
- Legend toggling
- Box/lasso selection
- Rangesliders for time series
- Buttons and dropdowns
- Animations

```python
# Custom hover template
fig.update_traces(
    hovertemplate='<b>%{x}</b><br>Value: %{y:.2f}<extra></extra>'
)

# Add rangeslider
fig.update_xaxes(rangeslider_visible=True)

# Animations
fig = px.scatter(df, x='x', y='y', animation_frame='year')
```

### 3. Export Options

**Interactive HTML:**
```python
fig.write_html('chart.html')                          # Full standalone
fig.write_html('chart.html', include_plotlyjs='cdn')   # Smaller file
```

**Static images (requires kaleido):**
```bash
pip install kaleido
```

```python
fig.write_image('chart.png')   # PNG
fig.write_image('chart.pdf')   # PDF
fig.write_image('chart.svg')   # SVG
```

## Common Workflows

### Scientific Data Visualization

```python
import plotly.express as px

# Scatter plot with trendline
fig = px.scatter(df, x='temperature', y='yield', trendline='ols')

# Heatmap from matrix
fig = px.imshow(correlation_matrix, text_auto=True, color_continuous_scale='RdBu')

# 3D surface plot
import plotly.graph_objects as go
fig = go.Figure(data=[go.Surface(z=z_data, x=x_data, y=y_data)])
```

### Statistical Analysis

```python
# Distribution comparison
fig = px.histogram(df, x='values', color='group', marginal='box', nbins=30)

# Box plot with all points
fig = px.box(df, x='category', y='value', points='all')

# Violin plot
fig = px.violin(df, x='group', y='measurement', box=True)
```

### Time Series and Financial

```python
# Time series with rangeslider
fig = px.line(df, x='date', y='price')
fig.update_xaxes(rangeslider_visible=True)

# Candlestick chart
import plotly.graph_objects as go
fig = go.Figure(data=[go.Candlestick(
    x=df['date'],
    open=df['open'], high=df['high'],
    low=df['low'], close=df['close']
)])
```

### Multi-Plot Dashboards

```python
from plotly.subplots import make_subplots
import plotly.graph_objects as go

fig = make_subplots(
    rows=2, cols=2,
    subplot_titles=('Scatter', 'Bar', 'Histogram', 'Box'),
    specs=[[{'type': 'scatter'}, {'type': 'bar'}],
           [{'type': 'histogram'}, {'type': 'box'}]]
)

fig.add_trace(go.Scatter(x=[1, 2, 3], y=[4, 5, 6]), row=1, col=1)
fig.add_trace(go.Bar(x=['A', 'B'], y=[1, 2]), row=1, col=2)
fig.add_trace(go.Histogram(x=data), row=2, col=1)
fig.add_trace(go.Box(y=data), row=2, col=2)

fig.update_layout(height=800, showlegend=False)
```

## Graph Objects Core Classes

| Class | Purpose |
|-------|---------|
| `go.Figure` | Main figure container |
| `go.FigureWidget` | Jupyter-compatible interactive widget |
| `go.Scatter` | Scatter/line trace |
| `go.Bar` | Bar chart trace |
| `go.Heatmap` | Heatmap trace |
| `go.Surface` | 3D surface trace |
| `go.Scatter3d` | 3D scatter trace |

```python
import plotly.graph_objects as go

fig = go.Figure()
fig.add_trace(go.Scatter(
    x=[1, 2, 3, 4], y=[10, 11, 12, 13],
    mode='lines+markers', name='Trace 1',
    line=dict(color='red', width=2, dash='dash'),
    marker=dict(size=10, color='blue', symbol='circle')
))
```

## Plotly Express Common Parameters

```python
fig = px.scatter(
    df, x="x", y="y",
    width=800, height=600,                            # Dimensions
    title="Figure Title",                              # Title
    labels={"x": "X Axis", "y": "Y Axis"},           # Axis labels
    color="category",                                  # Color by category
    color_discrete_map={"A": "red", "B": "blue"},     # Custom color mapping
    color_continuous_scale="Viridis",                  # Continuous scale
    category_orders={"category": ["A", "B", "C"]},    # Category ordering
    template="plotly_dark"                             # Theme template
)
```

## Integration with Dash

For interactive web applications, use Dash (Plotly's web app framework):

```python
import dash
from dash import dcc, html
import plotly.express as px

app = dash.Dash(__name__)
fig = px.scatter(df, x='x', y='y')

app.layout = html.Div([
    html.H1('Dashboard'),
    dcc.Graph(figure=fig)
])

app.run_server(debug=True)
```
