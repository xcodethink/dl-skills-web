> 来源：[K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills) | 分类：数据可视化

# Seaborn 统计可视化

## 概述

Seaborn 是基于 Matplotlib 构建的 Python 统计可视化库，用于创建出版级质量的统计图形。它以数据集为导向，支持多变量分析、自动统计估计和复杂的多面板图形。

## 设计理念

1. **面向数据集（Dataset-oriented）**：直接使用 DataFrame 和命名变量，而非抽象坐标
2. **语义映射（Semantic Mapping）**：自动将数据值转换为视觉属性（颜色、大小、样式）
3. **统计感知（Statistical Awareness）**：内置聚合、误差估计和置信区间
4. **美学默认值**：开箱即用的出版级主题和调色板
5. **Matplotlib 集成**：与 Matplotlib 自定义功能完全兼容

## 快速开始

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd

# 加载示例数据集
df = sns.load_dataset('tips')

# 创建可视化
sns.scatterplot(data=df, x='total_bill', y='tip', hue='day')
plt.show()
```

## 绑图接口

### 函数接口（传统方式）

提供按可视化类型组织的专门绑图函数。每个类别都有**坐标轴级别（Axes-level）**函数和**图形级别（Figure-level）**函数。

### Objects 接口（现代方式）

`seaborn.objects` 接口提供声明式、可组合的 API，类似于 ggplot2：

```python
from seaborn import objects as so

(
    so.Plot(data=df, x='total_bill', y='tip')
    .add(so.Dot(), color='day')
    .add(so.Line(), so.PolyFit())
)
```

## 按类别分类的绑图函数

### 关系图（Relational Plots）— 变量间关系

**用途：** 探索两个或多个变量之间的关系

| 函数 | 说明 |
|------|------|
| `scatterplot()` | 散点图，显示单个观测值 |
| `lineplot()` | 折线图，显示趋势（自动聚合并计算置信区间） |
| `relplot()` | 图形级接口，支持自动分面 |

**关键参数：** `x`、`y`（主变量）、`hue`（颜色编码）、`size`（点/线大小）、`style`（标记/线型）、`col`/`row`（分面子图）

```python
# 多维语义映射的散点图
sns.scatterplot(data=df, x='total_bill', y='tip',
                hue='time', size='size', style='sex')

# 带置信区间的折线图
sns.lineplot(data=timeseries, x='date', y='value', hue='category')

# 分面关系图
sns.relplot(data=df, x='total_bill', y='tip',
            col='time', row='sex', hue='smoker', kind='scatter')
```

### 分布图（Distribution Plots）— 数据分布

**用途：** 理解数据的分布、形状和概率密度

| 函数 | 说明 |
|------|------|
| `histplot()` | 直方图，基于条形的频率分布 |
| `kdeplot()` | 核密度估计（KDE），平滑密度曲线 |
| `ecdfplot()` | 经验累积分布函数 |
| `rugplot()` | 地毯图，单个观测值标记 |
| `displot()` | 图形级分布接口 |
| `jointplot()` | 双变量图 + 边际分布 |
| `pairplot()` | 成对关系矩阵 |

**关键参数：** `stat`（归一化方式：count/frequency/probability/density）、`bins`/`binwidth`、`bw_adjust`（KDE 带宽）、`fill`、`multiple`（hue 处理方式：layer/stack/dodge/fill）

```python
# 密度归一化的直方图
sns.histplot(data=df, x='total_bill', hue='time',
             stat='density', multiple='stack')

# 双变量 KDE 等高线
sns.kdeplot(data=df, x='total_bill', y='tip',
            fill=True, levels=5, thresh=0.1)

# 联合分布图
sns.jointplot(data=df, x='total_bill', y='tip',
              kind='scatter', hue='time')

# 成对关系图
sns.pairplot(data=df, hue='species', corner=True)
```

### 分类图（Categorical Plots）— 跨类别比较

**用途：** 比较不同离散类别下的分布或统计量

**分类散点图：**
- `stripplot()` — 带抖动的散点，显示所有观测值
- `swarmplot()` — 不重叠的散点（蜂群算法）

**分布比较：**
- `boxplot()` — 箱线图，四分位数和异常值
- `violinplot()` — 小提琴图，KDE + 四分位信息
- `boxenplot()` — 增强箱线图，适合大数据集

**统计估计：**
- `barplot()` — 均值/聚合 + 置信区间
- `pointplot()` — 点估计 + 连接线
- `countplot()` — 每个类别的计数

```python
# 蜂群图
sns.swarmplot(data=df, x='day', y='total_bill', hue='sex')

# 分裂小提琴图
sns.violinplot(data=df, x='day', y='total_bill',
               hue='sex', split=True)

# 带误差线的柱状图
sns.barplot(data=df, x='day', y='total_bill',
            hue='sex', estimator='mean', errorbar='ci')

# 分面分类图
sns.catplot(data=df, x='day', y='total_bill',
            col='time', kind='box')
```

### 回归图（Regression Plots）— 线性关系

| 函数 | 说明 |
|------|------|
| `regplot()` | 坐标轴级回归图（散点 + 拟合线） |
| `lmplot()` | 图形级回归图，支持分面 |
| `residplot()` | 残差图，评估模型拟合 |

```python
# 简单线性回归
sns.regplot(data=df, x='total_bill', y='tip')

# 多项式回归 + 分面
sns.lmplot(data=df, x='total_bill', y='tip',
           col='time', order=2, ci=95)
```

### 矩阵图（Matrix Plots）— 矩形数据

| 函数 | 说明 |
|------|------|
| `heatmap()` | 热力图，颜色编码矩阵 + 注释 |
| `clustermap()` | 层次聚类热力图 |

```python
# 相关矩阵热力图
corr = df.corr()
sns.heatmap(corr, annot=True, fmt='.2f',
            cmap='coolwarm', center=0, square=True)

# 聚类热力图
sns.clustermap(data, cmap='viridis',
               standard_scale=1, figsize=(10, 10))
```

## 图形级与坐标轴级函数

### 坐标轴级函数（Axes-level）

- 绘制到单个 Matplotlib `Axes` 对象
- 接受 `ax=` 参数用于精确放置
- 返回 `Axes` 对象
- 示例：`scatterplot`、`histplot`、`boxplot`、`regplot`、`heatmap`

**适用场景：** 构建自定义多图布局、组合不同图表类型、需要 Matplotlib 级别的控制

```python
fig, axes = plt.subplots(2, 2, figsize=(10, 10))
sns.scatterplot(data=df, x='x', y='y', ax=axes[0, 0])
sns.histplot(data=df, x='x', ax=axes[0, 1])
sns.boxplot(data=df, x='cat', y='y', ax=axes[1, 0])
sns.kdeplot(data=df, x='x', y='y', ax=axes[1, 1])
```

### 图形级函数（Figure-level）

- 管理整个图形，包括所有子图
- 内置分面（Faceting）：`col` 和 `row` 参数
- 返回 `FacetGrid`、`JointGrid` 或 `PairGrid` 对象
- 使用 `height` 和 `aspect` 控制尺寸
- 示例：`relplot`、`displot`、`catplot`、`lmplot`、`jointplot`、`pairplot`

```python
sns.relplot(data=df, x='x', y='y', col='category', row='group',
            hue='type', height=3, aspect=1.2)
```

## 多图网格

### FacetGrid — 基于分类变量的子图
```python
g = sns.FacetGrid(df, col='time', row='sex', hue='smoker')
g.map(sns.scatterplot, 'total_bill', 'tip')
g.add_legend()
```

### PairGrid — 成对变量关系
```python
g = sns.PairGrid(df, hue='species')
g.map_upper(sns.scatterplot)
g.map_lower(sns.kdeplot)
g.map_diag(sns.histplot)
g.add_legend()
```

### JointGrid — 双变量 + 边际分布
```python
g = sns.JointGrid(data=df, x='total_bill', y='tip')
g.plot_joint(sns.scatterplot)
g.plot_marginals(sns.histplot)
```

## 数据结构要求

### 长格式数据（Long-form）— 推荐

每个变量一列，每个观测值一行（"整洁"格式）：
```python
   subject  condition  measurement
0        1    control         10.5
1        1  treatment         12.3
```

### 宽格式数据（Wide-form）

变量分布在多列中，适用于简单矩形数据：
```python
   control  treatment
0     10.5       12.3
```

**宽格式转长格式：**
```python
df_long = df.melt(var_name='condition', value_name='measurement')
```

## 调色板（Color Palettes）

### 定性调色板（Qualitative）— 分类数据
- `"deep"` — 默认，鲜明色彩
- `"muted"` — 柔和色调
- `"colorblind"` — 色盲安全
- `"Set2"`、`"husl"`

### 顺序调色板（Sequential）— 有序数据
- `"rocket"`、`"mako"` — 宽亮度范围（适合热力图）
- `"viridis"`、`"magma"` — 感知均匀

### 发散调色板（Diverging）— 以中点为中心的数据
- `"vlag"` — 蓝到红
- `"coolwarm"`、`"RdBu"`

```python
# 使用色盲安全调色板
sns.set_palette("colorblind")

# 自定义调色板
custom = sns.color_palette("husl", 8)
palette = sns.light_palette("seagreen", as_cmap=True)
palette = sns.diverging_palette(250, 10, as_cmap=True)
```

## 主题与美学

### 样式（Styles）
- `"darkgrid"` — 灰色背景 + 白色网格（默认）
- `"whitegrid"` — 白色背景 + 灰色网格
- `"dark"` — 灰色背景，无网格
- `"white"` — 白色背景，无网格
- `"ticks"` — 白色背景 + 坐标轴刻度

### 上下文（Contexts）— 缩放元素
- `"paper"` — 最小（默认）
- `"notebook"` — 稍大
- `"talk"` — 演示幻灯片
- `"poster"` — 大幅面

```python
# 设置完整主题
sns.set_theme(style='whitegrid', palette='pastel', font='sans-serif')

# 设置上下文
sns.set_context("talk", font_scale=1.2)

# 移除边框
sns.despine(left=False, bottom=False, offset=10, trim=True)
```

## 最佳实践

### 1. 数据准备
始终使用结构良好的 DataFrame，列名有意义：
```python
df = pd.DataFrame({'bill': bills, 'tip': tips, 'day': days})
sns.scatterplot(data=df, x='bill', y='tip', hue='day')
```

### 2. 选择合适的图表类型

| 数据类型 | 推荐图表 |
|---------|---------|
| 连续 x + 连续 y | `scatterplot`、`lineplot`、`kdeplot`、`regplot` |
| 连续 x + 分类 y | `violinplot`、`boxplot`、`stripplot`、`swarmplot` |
| 单个连续变量 | `histplot`、`kdeplot`、`ecdfplot` |
| 相关性/矩阵 | `heatmap`、`clustermap` |
| 成对关系 | `pairplot`、`jointplot` |

### 3. 利用语义映射
```python
sns.scatterplot(data=df, x='x', y='y',
                hue='category',      # 按类别着色
                size='importance',    # 按连续变量调整大小
                style='type')         # 按类型改变标记样式
```

### 4. 控制统计估计
```python
# lineplot 默认计算均值和 95% 置信区间
sns.lineplot(data=df, x='time', y='value',
             errorbar='sd')  # 改用标准差

# barplot 默认计算均值
sns.barplot(data=df, x='category', y='value',
            estimator='median', errorbar=('ci', 95))
```

### 5. 与 Matplotlib 结合
```python
ax = sns.scatterplot(data=df, x='x', y='y')
ax.set(xlabel='Custom X Label', ylabel='Custom Y Label', title='Custom Title')
ax.axhline(y=0, color='r', linestyle='--')
plt.tight_layout()
```

### 6. 保存高质量图形
```python
fig = sns.relplot(data=df, x='x', y='y', col='group')
fig.savefig('figure.png', dpi=300, bbox_inches='tight')
fig.savefig('figure.pdf')  # 矢量格式用于出版
```

## 常见问题

| 问题 | 解决方案 |
|------|---------|
| 图例在绘图区外 | `g._legend.set_bbox_to_anchor((0.9, 0.5))` |
| 标签重叠 | `plt.xticks(rotation=45, ha='right'); plt.tight_layout()` |
| 图形太小（图形级） | `sns.relplot(..., height=6, aspect=1.5)` |
| 图形太小（坐标轴级） | `fig, ax = plt.subplots(figsize=(10, 6))` |
| 颜色不够鲜明 | `sns.set_palette("bright")` |
| KDE 过于平滑/锯齿 | 调整 `bw_adjust`：0.5（更锐利）/ 2（更平滑） |
