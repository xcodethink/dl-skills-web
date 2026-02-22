> Source: [K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills) | Category: Data Visualization

---
name: networkx
description: Comprehensive toolkit for creating, analyzing, and visualizing complex networks and graphs in Python.
---

# NetworkX

## Overview

NetworkX is a Python package for creating, manipulating, and analyzing complex networks and graphs. Use it when working with network or graph data structures, including social networks, biological networks, transportation systems, citation networks, knowledge graphs, or any system involving relationships between entities.

## When to Use

- **Creating graphs**: Building network structures from data, adding nodes and edges with attributes
- **Graph analysis**: Computing centrality measures, finding shortest paths, detecting communities, measuring clustering
- **Graph algorithms**: Running Dijkstra's, PageRank, minimum spanning trees, maximum flow
- **Network generation**: Creating synthetic networks (random, scale-free, small-world models)
- **Graph I/O**: Reading from or writing to various formats (edge lists, GraphML, JSON, CSV, adjacency matrices)
- **Visualization**: Drawing and customizing network visualizations with matplotlib or interactive libraries
- **Network comparison**: Checking isomorphism, computing graph metrics, analyzing structural properties

## Core Capabilities

### 1. Graph Creation and Manipulation

NetworkX supports four main graph types:

| Type | Description |
|------|-------------|
| `Graph` | Undirected graphs with single edges |
| `DiGraph` | Directed graphs with one-way connections |
| `MultiGraph` | Undirected graphs allowing multiple edges between nodes |
| `MultiDiGraph` | Directed graphs with multiple edges |

```python
import networkx as nx

G = nx.Graph()

# Add nodes (any hashable type)
G.add_node(1)
G.add_nodes_from([2, 3, 4])
G.add_node("protein_A", type='enzyme', weight=1.5)

# Add edges
G.add_edge(1, 2)
G.add_edges_from([(1, 3), (2, 4)])
G.add_edge(1, 4, weight=0.8, relation='interacts')
```

### 2. Graph Algorithms

**Shortest Paths:**
```python
path = nx.shortest_path(G, source=1, target=5)
length = nx.shortest_path_length(G, source=1, target=5, weight='weight')
```

**Centrality Measures:**
```python
degree_cent = nx.degree_centrality(G)
betweenness = nx.betweenness_centrality(G)
pagerank = nx.pagerank(G)
closeness = nx.closeness_centrality(G)
```

**Community Detection:**
```python
from networkx.algorithms import community

communities = community.greedy_modularity_communities(G)
```

**Connectivity:**
```python
is_connected = nx.is_connected(G)
components = list(nx.connected_components(G))
scc = list(nx.strongly_connected_components(G))  # Directed
```

**Clustering:**
```python
clustering_coeff = nx.clustering(G)
avg_clustering = nx.average_clustering(G)
```

### 3. Graph Generators

**Classic Graphs:**
```python
G = nx.complete_graph(n=10)
G = nx.cycle_graph(n=20)
G = nx.karate_club_graph()
G = nx.petersen_graph()
```

**Random Network Models:**
```python
# Erdos-Renyi random graph
G = nx.erdos_renyi_graph(n=100, p=0.1, seed=42)

# Barabasi-Albert scale-free network
G = nx.barabasi_albert_graph(n=100, m=3, seed=42)

# Watts-Strogatz small-world network
G = nx.watts_strogatz_graph(n=100, k=6, p=0.1, seed=42)
```

**Structured Networks:**
```python
G = nx.grid_2d_graph(m=5, n=7)     # Grid graph
G = nx.random_tree(n=100, seed=42)  # Random tree
```

### 4. Reading and Writing Graphs

**File Formats:**
```python
# Edge list
G = nx.read_edgelist('graph.edgelist')
nx.write_edgelist(G, 'graph.edgelist')

# GraphML (preserves attributes)
G = nx.read_graphml('graph.graphml')
nx.write_graphml(G, 'graph.graphml')

# GML
G = nx.read_gml('graph.gml')
nx.write_gml(G, 'graph.gml')

# JSON
data = nx.node_link_data(G)
G = nx.node_link_graph(data)
```

**Pandas Integration:**
```python
import pandas as pd

df = pd.DataFrame({
    'source': [1, 2, 3],
    'target': [2, 3, 4],
    'weight': [0.5, 1.0, 0.75]
})
G = nx.from_pandas_edgelist(df, 'source', 'target', edge_attr='weight')

df = nx.to_pandas_edgelist(G)
```

**Matrix Formats:**
```python
import numpy as np

A = nx.to_numpy_array(G)
G = nx.from_numpy_array(A)

A = nx.to_scipy_sparse_array(G)
G = nx.from_scipy_sparse_array(A)
```

### 5. Visualization

**Basic Visualization:**
```python
import matplotlib.pyplot as plt

nx.draw(G, with_labels=True)
plt.show()

pos = nx.spring_layout(G, seed=42)
nx.draw(G, pos=pos, with_labels=True, node_color='lightblue', node_size=500)
plt.show()
```

**Customization:**
```python
# Color by degree
node_colors = [G.degree(n) for n in G.nodes()]
nx.draw(G, node_color=node_colors, cmap=plt.cm.viridis)

# Size by centrality
centrality = nx.betweenness_centrality(G)
node_sizes = [3000 * centrality[n] for n in G.nodes()]
nx.draw(G, node_size=node_sizes)

# Edge weights
edge_widths = [3 * G[u][v].get('weight', 1) for u, v in G.edges()]
nx.draw(G, width=edge_widths)
```

**Layout Algorithms:**

| Layout | Function | Best For |
|--------|----------|----------|
| Spring (force-directed) | `nx.spring_layout(G, seed=42)` | General purpose |
| Circular | `nx.circular_layout(G)` | Equal node spacing |
| Kamada-Kawai | `nx.kamada_kawai_layout(G)` | Larger graphs |
| Spectral | `nx.spectral_layout(G)` | Based on graph Laplacian |
| Shell | `nx.shell_layout(G)` | Concentric circles |

**Publication Quality:**
```python
plt.figure(figsize=(12, 8))
pos = nx.spring_layout(G, seed=42)
nx.draw(G, pos=pos, node_color='lightblue', node_size=500,
        edge_color='gray', with_labels=True, font_size=10)
plt.title('Network Visualization', fontsize=16)
plt.axis('off')
plt.tight_layout()
plt.savefig('network.png', dpi=300, bbox_inches='tight')
plt.savefig('network.pdf', bbox_inches='tight')  # Vector format
```

## Common Workflow Pattern

```python
import networkx as nx
import matplotlib.pyplot as plt
import pandas as pd
from networkx.algorithms import community

# 1. Create or Load Graph
G = nx.Graph()
G.add_edges_from([(1, 2), (2, 3), (3, 4)])

# 2. Examine Structure
print(f"Nodes: {G.number_of_nodes()}")
print(f"Edges: {G.number_of_edges()}")
print(f"Density: {nx.density(G)}")
print(f"Connected: {nx.is_connected(G)}")

# 3. Analyze
degree_cent = nx.degree_centrality(G)
avg_clustering = nx.average_clustering(G)
path = nx.shortest_path(G, source=1, target=4)
communities = community.greedy_modularity_communities(G)

# 4. Visualize
pos = nx.spring_layout(G, seed=42)
nx.draw(G, pos=pos, with_labels=True)
plt.show()

# 5. Export Results
nx.write_graphml(G, 'analyzed_network.graphml')
df = pd.DataFrame({
    'node': list(degree_cent.keys()),
    'centrality': list(degree_cent.values())
})
df.to_csv('centrality_results.csv', index=False)
```

## Quick Reference

### Basic Operations
```python
G = nx.Graph()          # Create
G.add_edge(1, 2)        # Add edge

G.number_of_nodes()     # Node count
G.number_of_edges()     # Edge count
G.degree(1)             # Node degree
list(G.neighbors(1))    # Neighbor nodes

G.has_node(1)           # Check node
G.has_edge(1, 2)        # Check edge
nx.is_connected(G)      # Check connectivity

G.remove_node(1)        # Remove node
G.remove_edge(1, 2)     # Remove edge
G.clear()               # Clear graph
```

### Essential Algorithms
```python
# Paths
nx.shortest_path(G, source, target)
nx.all_pairs_shortest_path(G)

# Centrality
nx.degree_centrality(G)
nx.betweenness_centrality(G)
nx.closeness_centrality(G)
nx.pagerank(G)

# Clustering
nx.clustering(G)
nx.average_clustering(G)

# Components
nx.connected_components(G)
nx.strongly_connected_components(G)  # Directed

# Community
community.greedy_modularity_communities(G)
```

### File I/O
```python
# Read
nx.read_edgelist('file.txt')
nx.read_graphml('file.graphml')
nx.read_gml('file.gml')

# Write
nx.write_edgelist(G, 'file.txt')
nx.write_graphml(G, 'file.graphml')
nx.write_gml(G, 'file.gml')

# Pandas
nx.from_pandas_edgelist(df, 'source', 'target')
nx.to_pandas_edgelist(G)
```

## Important Considerations

- **Floating point precision**: When graphs contain floating-point numbers, all results are inherently approximate
- **Memory and performance**: Use sparse matrices for large sparse graphs; consider loading only necessary subgraphs; leverage approximate algorithms (`k` parameter in centrality calculations)
- **Node types**: Nodes can be any hashable Python object (numbers, strings, tuples)
- **Random seeds**: Always set random seeds for reproducibility:
  ```python
  G = nx.erdos_renyi_graph(n=100, p=0.1, seed=42)
  pos = nx.spring_layout(G, seed=42)
  ```
- **Node removal**: When removing nodes, all incident edges are automatically removed
