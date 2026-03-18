> 来源：[K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills) | 分类：数据可视化

# Matplotlib 数据可视化

## 概述

Matplotlib 是 Python 最基础的可视化库，用于创建静态、动画和交互式图表。它提供两种接口：pyplot 接口（MATLAB 风格）和面向对象 API（Figure/Axes），适合生成出版级质量的可视化图形。

## 适用场景

- 创建各类图表：折线图（Line Plot）、散点图（Scatter Plot）、柱状图（Bar Chart）、直方图（Histogram）、热力图（Heatmap）、等高线图（Contour Plot）等
- 科学与统计可视化
- 自定义图表外观（颜色、样式、标签、图例）
- 创建多面板子图布局
- 导出多种格式（PNG、PDF、SVG）
- 构建 3D 可视化

## 核心概念

### Matplotlib 对象层级

Matplotlib 使用层级化的对象结构：

1. **Figure** — 顶层容器，承载所有绑图元素
2. **Axes** — 实际的绑图区域（一个 Figure 可包含多个 Axes）
3. **Artist** — 图中所有可见元素（线条、文本、刻度等）
4. **Axis** — 坐标轴对象（x 轴、y 轴），管理刻度和标签

### 两种接口

**1. pyplot 接口（隐式，MATLAB 风格）**
```python
import matplotlib.pyplot as plt

plt.plot([1, 2, 3, 4])
plt.ylabel('some numbers')
plt.show()
```
- 适合快速、简单的绘图
- 自动维护状态
- 适用于交互式工作和简单脚本

**2. 面向对象接口（显式）— 推荐**
```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3, 4])
ax.set_ylabel('some numbers')
plt.show()
```
- **推荐用于大多数场景**
- 对 Figure 和 Axes 有更明确的控制
- 更适合包含多个子图的复杂图形
- 更易于维护和调试

## 常用工作流

### 1. 基础绑图

```python
import matplotlib.pyplot as plt
import numpy as np

# 创建 Figure 和 Axes（面向对象接口 - 推荐）
fig, ax = plt.subplots(figsize=(10, 6))

# 生成数据并绑图
x = np.linspace(0, 2*np.pi, 100)
ax.plot(x, np.sin(x), label='sin(x)')
ax.plot(x, np.cos(x), label='cos(x)')

# 自定义
ax.set_xlabel('x')
ax.set_ylabel('y')
ax.set_title('Trigonometric Functions')
ax.legend()
ax.grid(True, alpha=0.3)

# 保存和显示
plt.savefig('plot.png', dpi=300, bbox_inches='tight')
plt.show()
```

### 2. 多子图布局

```python
# 方法一：规则网格
fig, axes = plt.subplots(2, 2, figsize=(12, 10))
axes[0, 0].plot(x, y1)
axes[0, 1].scatter(x, y2)
axes[1, 0].bar(categories, values)
axes[1, 1].hist(data, bins=30)

# 方法二：Mosaic 布局（更灵活）
fig, axes = plt.subplot_mosaic([['left', 'right_top'],
                                 ['left', 'right_bottom']],
                                figsize=(10, 8))
axes['left'].plot(x, y)
axes['right_top'].scatter(x, y)
axes['right_bottom'].hist(data)

# 方法三：GridSpec（最大控制力）
from matplotlib.gridspec import GridSpec
fig = plt.figure(figsize=(12, 8))
gs = GridSpec(3, 3, figure=fig)
ax1 = fig.add_subplot(gs[0, :])    # 顶行，所有列
ax2 = fig.add_subplot(gs[1:, 0])   # 底部两行，第一列
ax3 = fig.add_subplot(gs[1:, 1:])  # 底部两行，后两列
```

### 3. 图表类型与适用场景

| 图表类型 | 适用场景 | 代码示例 |
|---------|---------|---------|
| 折线图（Line Plot） | 时间序列、连续数据、趋势 | `ax.plot(x, y, linewidth=2, linestyle='--', marker='o')` |
| 散点图（Scatter Plot） | 变量关系、相关性 | `ax.scatter(x, y, s=sizes, c=colors, alpha=0.6, cmap='viridis')` |
| 柱状图（Bar Chart） | 分类比较 | `ax.bar(categories, values, color='steelblue')` |
| 直方图（Histogram） | 分布 | `ax.hist(data, bins=30, edgecolor='black', alpha=0.7)` |
| 热力图（Heatmap） | 矩阵数据、相关性 | `ax.imshow(matrix, cmap='coolwarm', aspect='auto')` |
| 等高线图（Contour） | 二维平面上的三维数据 | `ax.contour(X, Y, Z, levels=10)` |
| 箱线图（Box Plot） | 统计分布 | `ax.boxplot([data1, data2, data3])` |
| 小提琴图（Violin Plot） | 分布密度 | `ax.violinplot([data1, data2, data3])` |

### 4. 样式与定制

**颜色指定方式：**
- 命名颜色：`'red'`、`'blue'`、`'steelblue'`
- 十六进制：`'#FF5733'`
- RGB 元组：`(0.1, 0.2, 0.3)`
- 色彩映射（Colormap）：`cmap='viridis'`、`cmap='plasma'`、`cmap='coolwarm'`

**使用样式表（Style Sheets）：**
```python
plt.style.use('seaborn-v0_8-darkgrid')  # 应用预定义样式
print(plt.style.available)               # 列出所有可用样式
```

**通过 rcParams 定制：**
```python
plt.rcParams['font.size'] = 12
plt.rcParams['axes.labelsize'] = 14
plt.rcParams['axes.titlesize'] = 16
plt.rcParams['xtick.labelsize'] = 10
plt.rcParams['ytick.labelsize'] = 10
plt.rcParams['legend.fontsize'] = 12
```

**文本与注释（Annotations）：**
```python
ax.text(x, y, 'annotation', fontsize=12, ha='center')
ax.annotate('important point', xy=(x, y), xytext=(x+1, y+1),
            arrowprops=dict(arrowstyle='->', color='red'))
```

### 5. 保存图形

```python
# 高分辨率 PNG（用于演示/论文）
plt.savefig('figure.png', dpi=300, bbox_inches='tight', facecolor='white')

# 矢量格式（用于出版，可缩放）
plt.savefig('figure.pdf', bbox_inches='tight')
plt.savefig('figure.svg', bbox_inches='tight')

# 透明背景
plt.savefig('figure.png', dpi=300, bbox_inches='tight', transparent=True)
```

**重要参数：**
| 参数 | 说明 |
|------|------|
| `dpi` | 分辨率：300（出版）、150（Web）、72（屏幕） |
| `bbox_inches='tight'` | 移除多余空白 |
| `facecolor='white'` | 确保白色背景 |
| `transparent=True` | 透明背景 |

### 6. 3D 绘图

```python
from mpl_toolkits.mplot3d import Axes3D

fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111, projection='3d')

# 曲面图（Surface Plot）
ax.plot_surface(X, Y, Z, cmap='viridis')

# 3D 散点图
ax.scatter(x, y, z, c=colors, marker='o')

# 坐标轴标签
ax.set_xlabel('X Label')
ax.set_ylabel('Y Label')
ax.set_zlabel('Z Label')
```

## 最佳实践

### 接口选择
- **使用面向对象接口**（`fig, ax = plt.subplots()`）编写正式代码
- pyplot 接口仅用于快速交互探索
- 始终显式创建 Figure，避免依赖隐式状态

### 图形尺寸与 DPI
- 在创建时设置 figsize：`fig, ax = plt.subplots(figsize=(10, 6))`
- 根据输出介质选择合适的 DPI：屏幕 72-100、Web 150、出版 300

### 布局管理
- 使用 `constrained_layout=True` 或 `tight_layout()` 防止元素重叠
- 推荐：`fig, ax = plt.subplots(constrained_layout=True)`

### 色彩映射选择
| 类型 | 适用场景 | 推荐 |
|------|---------|------|
| 顺序（Sequential） | 有序数据 | viridis、plasma、inferno |
| 发散（Diverging） | 以零为中心的数据 | coolwarm、RdBu |
| 定性（Qualitative） | 分类数据 | tab10、Set3 |

> 避免使用 rainbow/jet 色彩映射 — 它们并非感知均匀的

### 可访问性（Accessibility）
- 使用色盲友好的色彩映射（viridis、cividis）
- 柱状图除颜色外添加填充图案（Hatching）
- 确保元素之间有足够对比度
- 包含描述性标签和图例

### 性能优化
- 大数据集使用 `rasterized=True` 减少文件大小
- 绑图前进行适当的数据降采样
- 动画使用 blitting 技术提升性能

### 代码组织

```python
def create_analysis_plot(data, title):
    """创建标准化的分析图表。"""
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

## 常见问题

1. **元素重叠** — 使用 `constrained_layout=True` 或 `tight_layout()`
2. **状态混乱** — 使用面向对象接口，避免 pyplot 状态机问题
3. **内存泄漏** — 显式关闭图形：`plt.close(fig)`
4. **字体警告** — 安装字体或设置 `plt.rcParams['font.sans-serif']`
5. **DPI 与尺寸关系** — figsize 单位为英寸：`像素 = dpi × 英寸`

## 与其他工具集成

- **NumPy/Pandas** — 直接从数组和 DataFrame 绑图
- **Seaborn** — 基于 Matplotlib 构建的高级统计可视化
- **Jupyter** — 使用 `%matplotlib inline` 或 `%matplotlib widget` 进行交互绘图
- **GUI 框架** — 嵌入 Tkinter、Qt、wxPython 应用
