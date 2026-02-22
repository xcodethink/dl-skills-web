> 来源：[bear2u/my-skills](https://github.com/bear2u/my-skills) | 分类：C-AI工程与提示词

# Midjourney 卡片新闻背景生成器

根据主题、氛围和风格偏好，生成优化的 Midjourney 提示词，用于制作 600x600px 卡片新闻背景图。

## 使用场景

当用户请求以下内容时使用此技能：
- 卡片新闻背景图
- Instagram 帖子背景
- 社交媒体图形背景
- 600x600 或 1:1 比例的背景图

## 核心工作流程

1. **识别主题**：从用户请求中提取核心主题
2. **确定风格类别**：匹配预定义的风格模式
3. **生成提示词**：创建带最优参数的 Midjourney 提示词
4. **提供变体**：提供 3-5 种不同的风格选项

## 提示词结构

所有提示词遵循以下结构：
```
[主题/场景描述], [风格关键词], [色彩方案], [纹理/氛围], [技术参数] --ar 1:1 --v 6
```

### 核心组成部分

**主题描述**（5-10 个词）：
- 清晰描述视觉元素
- 使用具体、生动的形容词
- 避免抽象概念

**风格关键词**（3-5 个关键词）：
- minimal, clean, modern, professional
- gradient, abstract, geometric
- organic, fluid, soft, dreamy

**色彩方案**（指定具体颜色）：
- 使用准确的颜色名称："soft blue and purple" 而非 "cool colors"
- 包含强度描述："vibrant"、"pastel"、"muted"、"bright"
- 最多 3-4 种颜色保持统一

**纹理/氛围**（2-3 个关键词）：
- smooth, flowing, textured, grainy
- light and airy, bold and dramatic
- subtle, prominent, delicate

**技术参数**：
- 必须包含：`--ar 1:1`（600x600 方形格式）
- 版本：`--v 6`（当前 Midjourney 版本）
- 可选：`--s 50-200` 控制风格化程度

## 风格类别

快速参考，按主题匹配类别：

### 商业/科技
- 带几何元素的干净渐变
- 蓝、紫、青绿色系
- 专业现代感

### 健康/养生
- 带有机形状的柔和粉彩
- 绿、桃、柔粉色调
- 平静自然的氛围

### 金融/投资
- 带锐利线条的大胆渐变
- 海军蓝、金、绿色系
- 自信高端感

### 教育/学习
- 带简单形状的友好色彩
- 黄、橙、浅蓝色调
- 亲切有活力的氛围

### 美食/生活方式
- 带自然纹理的暖色调
- 大地色系、暖橙、棕色
- 温馨真实感

### 创意/艺术
- 大胆的抽象图案
- 鲜艳的多色系
- 富有表现力的动态能量

## 文字叠加优化

所有背景必须适合文字叠加：

**对比区域**：应包含：
- 微妙的渐变（非繁忙图案）
- 中心区域亮度一致
- 边缘较深或较浅增添视觉趣味

**空间规划**：
- 中心 60% 保持相对均匀
- 复杂元素放在角落
- 避免穿越中心的水平线条

**避免**：
- 高对比繁忙图案
- 中心区域与文字竞争的元素
- 过于细致的纹理

## 各主题提示词示例

**科技/AI**：
```
abstract neural network patterns, modern tech aesthetic, gradient blue and cyan tones, smooth digital waves, clean negative space for text, futuristic minimalism --ar 1:1 --v 6
```

**健身/运动**：
```
soft flowing energy waves, dynamic movement feel, gradient coral and peach colors, light and motivating atmosphere, space for text overlay --ar 1:1 --v 6
```

**金融/理财**：
```
elegant geometric patterns, premium professional style, navy and gold gradient, subtle texture with depth, sophisticated minimal design --ar 1:1 --v 6
```

**美食/烹饪**：
```
organic food texture background, warm earthy tones, rustic natural aesthetic, soft focus with gentle shadows, appetizing color palette --ar 1:1 --v 6
```

**心理健康**：
```
calming abstract clouds, serene peaceful atmosphere, soft lavender and mint gradients, dreamy gentle textures, meditative minimal space --ar 1:1 --v 6
```

## 回复格式

当用户提供主题时，以以下格式回复：

1. **主推荐**：最适合的风格
2. **备选方案 1**：同一主题的不同氛围/风格
3. **备选方案 2**：另一种变体
4. **简要说明**：为什么这些风格适合该主题

回复示例：
```
主题：理财小贴士

1. 主推荐：
[提示词]
-> 专业且富有信赖感的金融氛围

2. 备选方案 1：
[提示词]
-> 亲切且易于接近的感觉

3. 备选方案 2：
[提示词]
-> 高端精致的感觉
```

## 更好效果的技巧

**应该做的**：
- 使用具体的颜色名称
- 包含纹理描述
- 指定氛围/气氛
- 提示词控制在 60 个词以内
- 先从简单主题测试

**应避免的**：
- "nice" 或 "good" 等笼统词汇
- 过多相互竞争的元素
- 复杂的场景描述
- 过长的提示词
- 请求特定品牌/Logo

## 高级参数

用于微调（可选）：

- `--s 50`：更写实，风格化程度低
- `--s 150`：平衡的风格化（默认）
- `--s 250`：更多艺术化诠释
- `--chaos 0-100`：变化控制（0 = 一致性最高）

## 中文支持

当用户使用中文请求时：
- 理解中文主题描述
- 将概念翻译为英文提示词
- 用中文提供说明
- 提示词保持英文（Midjourney 要求）

## 常见主题参考

查阅 `topics_reference.md` 获取完整列表，包括：
- 行业专属色彩方案
- 季节性变体
- 趋势风格
- 文化考量
