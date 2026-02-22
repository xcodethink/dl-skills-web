> 来源：[K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills) | 分类：数据可视化

# Plotly 交互式可视化

## 概述

Plotly 是 Python 的交互式图形库，支持 40 多种图表类型，可创建具有悬停信息、缩放、平移功能的出版级可视化。适用于仪表盘（Dashboard）、探索性分析和演示文稿。

## 快速开始

```bash
pip install plotly
```

```python
import plotly.express as px
import pandas as pd

df = pd.DataFrame({
    'x': [1, 2, 3, 4],
    'y': [10, 11, 12, 13]
})

fig = px.scatter(df, x='x', y='y', title='My First Plot')
fig.show()
```

## API 选择指南

### Plotly Express（px）— 高级 API

适用于快速、标准的可视化，具有合理的默认设置：
- 直接处理 Pandas DataFrame
- 创建常见图表类型（散点图、折线图、柱状图、直方图等）
- 自动颜色编码和图例
- 代码量最少（1-5 行）

### Graph Objects（go）— 低级 API

适用于细粒度控制和自定义可视化：
- Plotly Express 中没有的图表类型（3D 网格、等值面、复杂金融图表）
- 从头构建复杂的多轨迹图形
- 需要对单个组件进行精确控制
- 创建带有自定义形状和注释的专业可视化

**两种 API 可以组合使用：**
```python
fig = px.scatter(df, x='x', y='y')
fig.update_layout(title='Custom Title')  # 在 px 图形上使用 go 方法
fig.add_hline(y=10)                      # 添加形状
```

## 图表类型总览

| 类别 | 图表类型 |
|------|---------|
| 基础图表（Basic） | 散点图（Scatter）、折线图（Line）、柱状图（Bar）、饼图（Pie）、面积图（Area）、气泡图（Bubble） |
| 统计图表（Statistical） | 直方图（Histogram）、箱线图（Box Plot）、小提琴图（Violin）、误差线（Error Bars） |
| 科学图表（Scientific） | 热力图（Heatmap）、等高线图（Contour）、三元图（Ternary） |
| 金融图表（Financial） | K 线图（Candlestick）、OHLC、瀑布图（Waterfall）、漏斗图（Funnel） |
| 地图（Maps） | 地理散点图、等值区域图（Choropleth）、密度地图 |
| 3D 图表 | 3D 散点图、曲面图（Surface）、网格图（Mesh） |
| 专业图表（Specialized） | 旭日图（Sunburst）、树图（Treemap）、桑基图（Sankey）、平行坐标（Parallel Coordinates） |

## 核心功能

### 1. 布局与样式

**子图（Subplots）：**
```python
from plotly.subplots import make_subplots
import plotly.graph_objects as go

fig = make_subplots(rows=2, cols=2, subplot_titles=('A', 'B', 'C', 'D'))
fig.add_trace(go.Scatter(x=[1, 2], y=[3, 4]), row=1, col=1)
```

**模板（Templates）：**
```python
fig = px.scatter(df, x='x', y='y', template='plotly_dark')
# 内置模板：plotly_white, plotly_dark, ggplot2, seaborn, simple_white
```

**自定义外观：**
- 颜色（离散序列、连续色阶）
- 字体和文本
- 坐标轴（范围、刻度、网格）
- 图例、边距和尺寸
- 注释和形状

### 2. 交互功能

内置交互特性：
- 悬停提示（Hover Tooltips）— 可自定义数据显示
- 平移和缩放（Pan & Zoom）
- 图例切换（Legend Toggling）
- 框选/套索选择（Box/Lasso Selection）
- 范围滑块（Rangeslider）— 用于时间序列
- 按钮和下拉菜单（Buttons & Dropdowns）
- 动画（Animations）

```python
# 自定义悬停模板
fig.update_traces(
    hovertemplate='<b>%{x}</b><br>Value: %{y:.2f}<extra></extra>'
)

# 添加范围滑块
fig.update_xaxes(rangeslider_visible=True)

# 动画
fig = px.scatter(df, x='x', y='y', animation_frame='year')
```

### 3. 导出选项

**交互式 HTML：**
```python
fig.write_html('chart.html')                          # 完整独立文件
fig.write_html('chart.html', include_plotlyjs='cdn')   # 较小文件
```

**静态图片（需要 kaleido）：**
```bash
pip install kaleido
```

```python
fig.write_image('chart.png')   # PNG
fig.write_image('chart.pdf')   # PDF
fig.write_image('chart.svg')   # SVG
```

## 常用工作流

### 科学数据可视化

```python
import plotly.express as px

# 带趋势线的散点图
fig = px.scatter(df, x='temperature', y='yield', trendline='ols')

# 相关矩阵热力图
fig = px.imshow(correlation_matrix, text_auto=True, color_continuous_scale='RdBu')

# 3D 曲面图
import plotly.graph_objects as go
fig = go.Figure(data=[go.Surface(z=z_data, x=x_data, y=y_data)])
```

### 统计分析

```python
# 分布比较
fig = px.histogram(df, x='values', color='group', marginal='box', nbins=30)

# 带全部数据点的箱线图
fig = px.box(df, x='category', y='value', points='all')

# 小提琴图
fig = px.violin(df, x='group', y='measurement', box=True)
```

### 时间序列与金融

```python
# 带范围滑块的时间序列
fig = px.line(df, x='date', y='price')
fig.update_xaxes(rangeslider_visible=True)

# K 线图（Candlestick）
import plotly.graph_objects as go
fig = go.Figure(data=[go.Candlestick(
    x=df['date'],
    open=df['open'],
    high=df['high'],
    low=df['low'],
    close=df['close']
)])
```

### 多图仪表盘

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

## 与 Dash 集成

使用 Dash（Plotly 的 Web 应用框架）构建交互式 Web 应用：

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

## Graph Objects 核心类

| 类 | 说明 |
|---|------|
| `go.Figure` | 主图形容器 |
| `go.FigureWidget` | Jupyter 兼容的交互式小部件（Widget） |
| `go.Scatter` | 散点/折线图轨迹 |
| `go.Bar` | 柱状图轨迹 |
| `go.Heatmap` | 热力图轨迹 |
| `go.Surface` | 3D 曲面轨迹 |
| `go.Scatter3d` | 3D 散点图轨迹 |

```python
import plotly.graph_objects as go

fig = go.Figure()
fig.add_trace(go.Scatter(
    x=[1, 2, 3, 4],
    y=[10, 11, 12, 13],
    mode='lines+markers',
    name='Trace 1',
    line=dict(color='red', width=2, dash='dash'),
    marker=dict(size=10, color='blue', symbol='circle')
))
fig.show()
```

## Plotly Express 常用参数

```python
fig = px.scatter(
    df, x="x", y="y",
    width=800, height=600,                            # 尺寸
    title="Figure Title",                              # 标题
    labels={"x": "X Axis", "y": "Y Axis"},           # 标签
    color="category",                                  # 按类别着色
    color_discrete_map={"A": "red", "B": "blue"},     # 自定义颜色映射
    color_continuous_scale="Viridis",                  # 连续色阶
    category_orders={"category": ["A", "B", "C"]},    # 类别排序
    template="plotly_dark"                             # 主题模板
)
```
