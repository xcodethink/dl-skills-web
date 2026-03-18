> 来源：[K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills) | 分类：数据可视化

# NetworkX 网络图分析与可视化

## 概述

NetworkX 是用于创建、操作和分析复杂网络（Network）与图（Graph）的 Python 包。适用于社交网络（Social Networks）、生物网络（Biological Networks）、交通系统、引用网络、知识图谱（Knowledge Graphs）或任何涉及实体间关系的系统。

## 适用场景

- **创建图** — 从数据构建网络结构，添加带属性的节点和边
- **图分析** — 计算中心性度量（Centrality）、寻找最短路径、检测社区、测量聚类
- **图算法** — 运行 Dijkstra、PageRank、最小生成树（MST）、最大流等标准算法
- **网络生成** — 创建合成网络（随机、无标度、小世界模型）用于测试或模拟
- **图 I/O** — 读写多种格式（边列表、GraphML、JSON、CSV、邻接矩阵）
- **可视化** — 使用 Matplotlib 或交互式库绘制和自定义网络可视化
- **网络比较** — 检查同构（Isomorphism）、计算图度量、分析结构属性

## 核心功能

### 1. 图的创建与操作

NetworkX 支持四种主要图类型：

| 图类型 | 说明 |
|--------|------|
| `Graph` | 无向图（Undirected），单条边 |
| `DiGraph` | 有向图（Directed），单向连接 |
| `MultiGraph` | 无向多重图，允许节点间多条边 |
| `MultiDiGraph` | 有向多重图 |

```python
import networkx as nx

# 创建空图
G = nx.Graph()

# 添加节点（可以是任何可哈希类型）
G.add_node(1)
G.add_nodes_from([2, 3, 4])
G.add_node("protein_A", type='enzyme', weight=1.5)

# 添加边
G.add_edge(1, 2)
G.add_edges_from([(1, 3), (2, 4)])
G.add_edge(1, 4, weight=0.8, relation='interacts')
```

### 2. 图算法

**最短路径（Shortest Paths）：**
```python
path = nx.shortest_path(G, source=1, target=5)
length = nx.shortest_path_length(G, source=1, target=5, weight='weight')
```

**中心性度量（Centrality Measures）：**
```python
# 度中心性（Degree Centrality）
degree_cent = nx.degree_centrality(G)

# 介数中心性（Betweenness Centrality）
betweenness = nx.betweenness_centrality(G)

# PageRank
pagerank = nx.pagerank(G)

# 接近中心性（Closeness Centrality）
closeness = nx.closeness_centrality(G)
```

**社区检测（Community Detection）：**
```python
from networkx.algorithms import community

communities = community.greedy_modularity_communities(G)
```

**连通性（Connectivity）：**
```python
is_connected = nx.is_connected(G)
components = list(nx.connected_components(G))

# 有向图的强连通分量
scc = list(nx.strongly_connected_components(G))
```

**聚类（Clustering）：**
```python
clustering_coeff = nx.clustering(G)
avg_clustering = nx.average_clustering(G)
```

### 3. 图生成器（Graph Generators）

**经典图：**
```python
G = nx.complete_graph(n=10)      # 完全图
G = nx.cycle_graph(n=20)         # 环图
G = nx.karate_club_graph()       # 空手道俱乐部图
G = nx.petersen_graph()          # Petersen 图
```

**随机网络模型：**
```python
# Erdos-Renyi 随机图
G = nx.erdos_renyi_graph(n=100, p=0.1, seed=42)

# Barabasi-Albert 无标度网络（Scale-free Network）
G = nx.barabasi_albert_graph(n=100, m=3, seed=42)

# Watts-Strogatz 小世界网络（Small-world Network）
G = nx.watts_strogatz_graph(n=100, k=6, p=0.1, seed=42)
```

**结构化网络：**
```python
G = nx.grid_2d_graph(m=5, n=7)   # 网格图（Grid Graph）
G = nx.random_tree(n=100, seed=42) # 随机树
```

### 4. 读写图数据

**文件格式：**
```python
# 边列表（Edge List）
G = nx.read_edgelist('graph.edgelist')
nx.write_edgelist(G, 'graph.edgelist')

# GraphML（保留属性）
G = nx.read_graphml('graph.graphml')
nx.write_graphml(G, 'graph.graphml')

# GML
G = nx.read_gml('graph.gml')
nx.write_gml(G, 'graph.gml')

# JSON
data = nx.node_link_data(G)
G = nx.node_link_graph(data)
```

**Pandas 集成：**
```python
import pandas as pd

# 从 DataFrame 创建
df = pd.DataFrame({
    'source': [1, 2, 3],
    'target': [2, 3, 4],
    'weight': [0.5, 1.0, 0.75]
})
G = nx.from_pandas_edgelist(df, 'source', 'target', edge_attr='weight')

# 导出为 DataFrame
df = nx.to_pandas_edgelist(G)
```

**矩阵格式：**
```python
import numpy as np

# 邻接矩阵（Adjacency Matrix）
A = nx.to_numpy_array(G)
G = nx.from_numpy_array(A)

# 稀疏矩阵（Sparse Matrix）
A = nx.to_scipy_sparse_array(G)
G = nx.from_scipy_sparse_array(A)
```

### 5. 可视化

**基础可视化：**
```python
import matplotlib.pyplot as plt

# 简单绘制
nx.draw(G, with_labels=True)
plt.show()

# 指定布局
pos = nx.spring_layout(G, seed=42)
nx.draw(G, pos=pos, with_labels=True, node_color='lightblue', node_size=500)
plt.show()
```

**自定义可视化：**
```python
# 按度着色
node_colors = [G.degree(n) for n in G.nodes()]
nx.draw(G, node_color=node_colors, cmap=plt.cm.viridis)

# 按中心性调整大小
centrality = nx.betweenness_centrality(G)
node_sizes = [3000 * centrality[n] for n in G.nodes()]
nx.draw(G, node_size=node_sizes)

# 边宽度按权重
edge_widths = [3 * G[u][v].get('weight', 1) for u, v in G.edges()]
nx.draw(G, width=edge_widths)
```

**布局算法（Layout Algorithms）：**

| 布局 | 函数 | 适用场景 |
|------|------|---------|
| 弹簧布局（Spring） | `nx.spring_layout(G, seed=42)` | 通用，力导向 |
| 环形布局（Circular） | `nx.circular_layout(G)` | 等距排列节点 |
| Kamada-Kawai | `nx.kamada_kawai_layout(G)` | 较大图形 |
| 谱布局（Spectral） | `nx.spectral_layout(G)` | 基于图的拉普拉斯矩阵 |
| Shell 布局 | `nx.shell_layout(G)` | 同心圆排列 |

**出版级质量图形：**
```python
plt.figure(figsize=(12, 8))
pos = nx.spring_layout(G, seed=42)
nx.draw(G, pos=pos, node_color='lightblue', node_size=500,
        edge_color='gray', with_labels=True, font_size=10)
plt.title('Network Visualization', fontsize=16)
plt.axis('off')
plt.tight_layout()
plt.savefig('network.png', dpi=300, bbox_inches='tight')
plt.savefig('network.pdf', bbox_inches='tight')  # 矢量格式
```

## 常见工作流模式

```python
import networkx as nx
import matplotlib.pyplot as plt
import pandas as pd

# 1. 创建或加载图
G = nx.Graph()
G.add_edges_from([(1, 2), (2, 3), (3, 4)])

# 2. 检查结构
print(f"Nodes: {G.number_of_nodes()}")
print(f"Edges: {G.number_of_edges()}")
print(f"Density: {nx.density(G)}")
print(f"Connected: {nx.is_connected(G)}")

# 3. 分析
degree_cent = nx.degree_centrality(G)
avg_clustering = nx.average_clustering(G)
path = nx.shortest_path(G, source=1, target=4)
communities = community.greedy_modularity_communities(G)

# 4. 可视化
pos = nx.spring_layout(G, seed=42)
nx.draw(G, pos=pos, with_labels=True)
plt.show()

# 5. 导出结果
nx.write_graphml(G, 'analyzed_network.graphml')
df = pd.DataFrame({
    'node': list(degree_cent.keys()),
    'centrality': list(degree_cent.values())
})
df.to_csv('centrality_results.csv', index=False)
```

## 快速参考

### 基础操作
```python
G = nx.Graph()          # 创建
G.add_edge(1, 2)        # 添加边

G.number_of_nodes()     # 节点数
G.number_of_edges()     # 边数
G.degree(1)             # 节点度
list(G.neighbors(1))    # 邻居节点

G.has_node(1)           # 检查节点
G.has_edge(1, 2)        # 检查边
nx.is_connected(G)      # 检查连通性

G.remove_node(1)        # 删除节点
G.remove_edge(1, 2)     # 删除边
G.clear()               # 清空图
```

### 核心算法
```python
# 路径
nx.shortest_path(G, source, target)
nx.all_pairs_shortest_path(G)

# 中心性
nx.degree_centrality(G)
nx.betweenness_centrality(G)
nx.closeness_centrality(G)
nx.pagerank(G)

# 聚类
nx.clustering(G)
nx.average_clustering(G)

# 连通分量
nx.connected_components(G)
nx.strongly_connected_components(G)  # 有向图

# 社区检测
community.greedy_modularity_communities(G)
```

### 文件 I/O
```python
# 读取
nx.read_edgelist('file.txt')
nx.read_graphml('file.graphml')
nx.read_gml('file.gml')

# 写入
nx.write_edgelist(G, 'file.txt')
nx.write_graphml(G, 'file.graphml')
nx.write_gml(G, 'file.gml')

# Pandas
nx.from_pandas_edgelist(df, 'source', 'target')
nx.to_pandas_edgelist(G)
```

## 重要注意事项

- **浮点精度**：包含浮点数的图，所有结果本质上是近似的
- **内存与性能**：大型网络使用稀疏矩阵；考虑只加载必要的子图；使用近似算法（如中心性计算中的 `k` 参数）
- **节点类型**：节点可以是任何可哈希的 Python 对象（数字、字符串、元组）
- **随机种子**：始终设置随机种子以确保可重复性：
  ```python
  G = nx.erdos_renyi_graph(n=100, p=0.1, seed=42)
  pos = nx.spring_layout(G, seed=42)
  ```
- **删除节点**：删除节点时，所有关联的边会自动删除
