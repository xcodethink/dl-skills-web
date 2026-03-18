> 来源：[mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | 分类：H-文档处理

# PPTX 创建、编辑和分析

## 概述

用户可能要求你创建、编辑或分析 .pptx 文件的内容。.pptx 文件本质上是一个包含 XML 文件和其他资源的 ZIP 归档，你可以读取或编辑。针对不同任务有不同的工具和工作流。

## 读取和分析内容

### 文本提取
如果只需要读取演示文稿的文本内容，应将文档转换为 Markdown：

```bash
# 将文档转换为 Markdown
python -m markitdown path-to-file.pptx
```

### 原始 XML 访问
以下情况需要原始 XML 访问：批注、演讲者备注、幻灯片版式、动画、设计元素和复杂格式。对于这些功能，需要解包演示文稿并读取原始 XML 内容。

#### 解包文件
`python ooxml/scripts/unpack.py <office_file> <output_dir>`

**说明**：unpack.py 脚本位于相对于项目根目录的 `skills/pptx/ooxml/scripts/unpack.py`。如果该路径下不存在脚本，使用 `find . -name "unpack.py"` 定位它。

#### 关键文件结构
* `ppt/presentation.xml` - 主演示文稿元数据和幻灯片引用
* `ppt/slides/slide{N}.xml` - 单个幻灯片内容（slide1.xml、slide2.xml 等）
* `ppt/notesSlides/notesSlide{N}.xml` - 每张幻灯片的演讲者备注
* `ppt/comments/modernComment_*.xml` - 特定幻灯片的批注
* `ppt/slideLayouts/` - 幻灯片版式模板
* `ppt/slideMasters/` - 母版幻灯片模板
* `ppt/theme/` - 主题和样式信息
* `ppt/media/` - 图像和其他媒体文件

#### 字体和颜色提取
**当需要模仿示例设计时**：始终先使用以下方法分析演示文稿的字体和颜色：
1. **读取主题文件**：检查 `ppt/theme/theme1.xml` 中的颜色（`<a:clrScheme>`）和字体（`<a:fontScheme>`）
2. **检查幻灯片内容**：检查 `ppt/slides/slide1.xml` 中的实际字体用法（`<a:rPr>`）和颜色
3. **搜索模式**：使用 grep 在所有 XML 文件中查找颜色（`<a:solidFill>`、`<a:srgbClr>`）和字体引用

## 不使用模板创建新 PowerPoint 演示文稿

从头创建新 PowerPoint 演示文稿时，使用 **html2pptx** 工作流将 HTML 幻灯片转换为具有精确定位的 PowerPoint。

### 设计原则

**关键**：创建任何演示文稿之前，分析内容并选择适当的设计元素：
1. **考虑主题**：演示文稿关于什么？暗示什么基调、行业或氛围？
2. **检查品牌**：如果用户提到公司/组织，考虑其品牌色彩和身份
3. **配色匹配内容**：选择反映主题的颜色
4. **说明方法**：在编写代码之前解释设计选择

**要求**：
- 在编写代码前说明基于内容的设计方法
- 仅使用网页安全字体：Arial、Helvetica、Times New Roman、Georgia、Courier New、Verdana、Tahoma、Trebuchet MS、Impact
- 通过大小、粗细和颜色创建清晰的视觉层次
- 确保可读性：强对比度、适当大小的文本、整洁的对齐
- 保持一致性：跨幻灯片重复模式、间距和视觉语言

#### 配色方案选择

**创造性地选择颜色**：
- **超越默认**：什么颜色真正匹配这个特定主题？避免自动化选择。
- **考虑多个角度**：主题、行业、氛围、能量水平、目标受众、品牌身份（如提及）
- **大胆尝试**：尝试意想不到的组合 - 医疗演示不一定是绿色，金融不一定是海军蓝
- **构建调色板**：选择 3-5 种协调的颜色（主色 + 辅助色 + 强调色）
- **确保对比度**：文本必须在背景上清晰可读

**示例配色方案**（用于激发创意 - 选择一个、改编或创建自己的）：

1. **经典蓝**：深海军蓝 (#1C2833)、灰蓝 (#2E4053)、银色 (#AAB7B8)、米白 (#F4F6F6)
2. **青色与珊瑚**：青色 (#5EA8A7)、深青 (#277884)、珊瑚 (#FE4447)、白色 (#FFFFFF)
3. **大胆红**：红色 (#C0392B)、亮红 (#E74C3C)、橙色 (#F39C12)、黄色 (#F1C40F)、绿色 (#2ECC71)
4. **温暖腮红**：紫灰 (#A49393)、腮红 (#EED6D3)、玫瑰 (#E8B4B8)、奶油 (#FAF7F2)
5. **酒红奢华**：酒红 (#5D1D2E)、深红 (#951233)、铁锈 (#C15937)、金色 (#997929)
6. **深紫与翡翠**：紫色 (#B165FB)、深蓝 (#181B24)、翡翠 (#40695B)、白色 (#FFFFFF)
7. **奶油与森林绿**：奶油 (#FFE1C7)、森林绿 (#40695B)、白色 (#FCFCFC)
8. **粉色与紫色**：粉色 (#F8275B)、珊瑚 (#FF574A)、玫瑰 (#FF737D)、紫色 (#3D2F68)
9. **青柠与梅色**：青柠 (#C5DE82)、梅色 (#7C3A5F)、珊瑚 (#FD8C6E)、蓝灰 (#98ACB5)
10. **黑金**：金色 (#BF9A4A)、黑色 (#000000)、奶油 (#F4F6F6)
11. **鼠尾草与赤陶**：鼠尾草 (#87A96B)、赤陶 (#E07A5F)、奶油 (#F4F1DE)、炭灰 (#2C2C2C)
12. **炭灰与红**：炭灰 (#292929)、红色 (#E33737)、浅灰 (#CCCBCB)
13. **活力橙**：橙色 (#F96D00)、浅灰 (#F2F2F2)、炭灰 (#222831)
14. **森林绿**：黑色 (#191A19)、绿色 (#4E9F3D)、深绿 (#1E5128)、白色 (#FFFFFF)
15. **复古彩虹**：紫色 (#722880)、粉色 (#D72D51)、橙色 (#EB5C18)、琥珀 (#F08800)、金色 (#DEB600)
16. **复古大地**：芥末 (#E3B448)、鼠尾草 (#CBD18F)、森林绿 (#3A6B35)、奶油 (#F4F1DE)
17. **海岸玫瑰**：旧玫瑰 (#AD7670)、海狸 (#B49886)、蛋壳 (#F3ECDC)、灰绿 (#BFD5BE)
18. **橙色与青绿**：浅橙 (#FC993E)、灰青绿 (#667C6F)、白色 (#FCFCFC)

#### 视觉细节选项

**几何图案**：
- 对角线分区而非水平分区
- 不对称列宽（30/70、40/60、25/75）
- 旋转文字标题 90 度或 270 度
- 圆形/六角形图像框
- 角落三角形装饰
- 重叠形状以增加深度

**边框与框架处理**：
- 仅一侧的粗单色边框（10-20pt）
- 对比色双线边框
- 角括号代替完整框架
- L 形边框（上+左或下+右）
- 标题下方的下划线强调（3-5pt 粗）

**排版处理**：
- 极端大小对比（72pt 标题 vs 11pt 正文）
- 全大写标题配宽字间距
- 超大号显示数字用于编号章节
- 等宽字体（Courier New）用于数据/统计/技术内容
- 窄字体（Arial Narrow）用于密集信息
- 轮廓文字用于强调

**图表与数据样式**：
- 单色图表搭配单个强调色突出关键数据
- 水平条形图代替垂直条形图
- 点阵图代替条形图
- 最少或不使用网格线
- 数据标签直接放在元素上（无图例）
- 超大号数字用于关键指标

**布局创新**：
- 全出血图像配文字叠加
- 侧边栏（20-30% 宽度）用于导航/上下文
- 模块化网格系统（3x3、4x4 块）
- Z 形或 F 形内容流
- 浮动文本框覆盖彩色形状
- 杂志风格多列布局

**背景处理**：
- 占据幻灯片 40-60% 的纯色块
- 渐变填充（仅垂直或对角线）
- 分割背景（两种颜色，对角线或垂直）
- 边到边色带
- 负空间作为设计元素

### 布局提示
**创建带图表或表格的幻灯片时：**
- **双列布局（推荐）**：使用全宽标题，下方两列 - 一列文字/要点，另一列放特色内容。用 flexbox 配不等列宽（如 40%/60% 分割）以优化每种内容类型的空间。
- **全幻灯片布局**：让特色内容（图表/表格）占据整个幻灯片以获得最大影响力和可读性
- **绝不垂直堆叠**：不要将图表/表格放在单列文本下方 - 这会导致可读性差和布局问题

### 工作流
1. **必须 - 读取完整文件**：完整阅读 [`html2pptx.md`](html2pptx.md)。**读取此文件时绝不设置范围限制。**
2. 为每张幻灯片创建带有正确尺寸的 HTML 文件（如 16:9 为 720pt x 405pt）
   - 所有文本内容使用 `<p>`、`<h1>`-`<h6>`、`<ul>`、`<ol>`
   - 图表/表格将添加的区域使用 `class="placeholder"`（用灰色背景渲染以增加可见性）
   - **关键**：先使用 Sharp 将渐变和图标光栅化为 PNG 图像，然后在 HTML 中引用
   - **布局**：带图表/表格/图像的幻灯片使用全幻灯片布局或双列布局以提高可读性
3. 创建并运行 JavaScript 文件，使用 [`html2pptx.js`](scripts/html2pptx.js) 库将 HTML 幻灯片转换为 PowerPoint 并保存
   - 使用 `html2pptx()` 函数处理每个 HTML 文件
   - 使用 PptxGenJS API 在占位符区域添加图表和表格
   - 使用 `pptx.writeFile()` 保存演示文稿
4. **视觉验证**：生成缩略图并检查布局问题
   - 创建缩略图网格：`python scripts/thumbnail.py output.pptx workspace/thumbnails --cols 4`
   - 读取并仔细检查缩略图图像：
     - **文本截断**：文本被标题栏、形状或幻灯片边缘截断
     - **文本重叠**：文本与其他文本或形状重叠
     - **定位问题**：内容太靠近幻灯片边界或其他元素
     - **对比度问题**：文本与背景之间对比度不足
   - 如发现问题，调整 HTML 的边距/间距/颜色并重新生成演示文稿
   - 重复直到所有幻灯片视觉正确

## 编辑现有 PowerPoint 演示文稿

编辑现有 PowerPoint 演示文稿中的幻灯片时，需要使用原始 Office Open XML（OOXML）格式。这涉及解包 .pptx 文件、编辑 XML 内容，然后重新打包。

### 工作流
1. **必须 - 读取完整文件**：完整阅读 [`ooxml.md`](ooxml.md)（约 500 行）。**读取此文件时绝不设置范围限制。**
2. 解包演示文稿：`python ooxml/scripts/unpack.py <office_file> <output_dir>`
3. 编辑 XML 文件（主要是 `ppt/slides/slide{N}.xml` 和相关文件）
4. **关键**：每次编辑后立即验证并在继续之前修复任何验证错误：`python ooxml/scripts/validate.py <dir> --original <file>`
5. 打包最终演示文稿：`python ooxml/scripts/pack.py <input_directory> <office_file>`

## 使用模板创建新 PowerPoint 演示文稿

需要创建遵循现有模板设计的演示文稿时，需要复制和重新排列模板幻灯片，然后替换占位符内容。

### 工作流
1. **提取模板文本并创建视觉缩略图网格**：
   * 提取文本：`python -m markitdown template.pptx > template-content.md`
   * 读取 `template-content.md`：读取完整文件以理解模板演示文稿的内容。**读取此文件时绝不设置范围限制。**
   * 创建缩略图网格：`python scripts/thumbnail.py template.pptx`
   * 参见[创建缩略图网格](#创建缩略图网格)部分了解更多详情

2. **分析模板并保存清单到文件**：
   * **视觉分析**：审查缩略图网格以理解幻灯片版式、设计模式和视觉结构
   * 在 `template-inventory.md` 创建并保存模板清单文件，包含：
     ```markdown
     # 模板清单分析
     **总幻灯片数：[数量]**
     **重要：幻灯片从 0 开始索引（第一张 = 0，最后一张 = 数量-1）**

     ## [分类名称]
     - 幻灯片 0：[版式代码（如有）] - 描述/用途
     - 幻灯片 1：[版式代码] - 描述/用途
     - 幻灯片 2：[版式代码] - 描述/用途
     [... 每张幻灯片都必须单独列出其索引 ...]
     ```
   * 此清单文件是下一步选择适当模板的**必需**文件

3. **基于模板清单创建演示大纲**：
   * 审查步骤 2 中的可用模板
   * 为第一张幻灯片选择引言或标题模板
   * 为其他幻灯片选择安全的、基于文本的版式
   * **关键：将版式结构与实际内容匹配**：
     - 单列版式：用于统一叙事或单一主题
     - 双列版式：仅在有恰好 2 个不同项目/概念时使用
     - 三列版式：仅在有恰好 3 个不同项目/概念时使用
     - 图文版式：仅在有实际图像可插入时使用
     - 引用版式：仅用于人物的实际引用（带署名），绝不用于强调
   * 在选择版式前计算实际内容片段数量
   * 保存包含内容和模板映射的 `outline.md`

4. **使用 `rearrange.py` 复制、重新排序和删除幻灯片**：
   ```bash
   python scripts/rearrange.py template.pptx working.pptx 0,34,34,50,52
   ```
   * 脚本自动处理重复幻灯片的复制、删除未使用的幻灯片和重新排序
   * 幻灯片索引从 0 开始（第一张为 0，第二张为 1 等）
   * 同一索引可多次出现以复制该幻灯片

5. **使用 `inventory.py` 脚本提取所有文本**：
   ```bash
   python scripts/inventory.py working.pptx text-inventory.json
   ```
   * 读取完整的 text-inventory.json 文件以理解所有形状及其属性。**读取此文件时绝不设置范围限制。**
   * JSON 结构包含按视觉位置排序的幻灯片、形状和段落信息

6. **生成替换文本并保存数据到 JSON 文件**：
   - **关键**：先验证清单中存在哪些形状 - 仅引用实际存在的形状
   - **自动清除**：清单中所有文本形状将被清除，除非你为它们提供 "paragraphs"
   - 为需要内容的形状添加 "paragraphs" 字段（不是 "replacement_paragraphs"）
   - 替换 JSON 中没有 "paragraphs" 的形状将被自动清除文本
   - 包含原始清单中的段落属性 - 不要只提供文本
   - **重要**：当 bullet: true 时，不要在文本中包含项目符号（-、*） - 它们会自动添加
   - 保存更新的清单和替换内容到 `replacement-text.json`

   段落字段示例（展示正确格式）：
   ```json
   "paragraphs": [
     {
       "text": "新演示文稿标题文本",
       "alignment": "CENTER",
       "bold": true
     },
     {
       "text": "章节标题",
       "bold": true
     },
     {
       "text": "不带项目符号的第一个要点",
       "bullet": true,
       "level": 0
     },
     {
       "text": "普通段落文本，无特殊格式"
     }
   ]
   ```

7. **使用 `replace.py` 脚本应用替换**：
   ```bash
   python scripts/replace.py working.pptx replacement-text.json output.pptx
   ```

## 创建缩略图网格

为 PowerPoint 幻灯片创建视觉缩略图网格以便快速分析和参考：

```bash
python scripts/thumbnail.py template.pptx [output_prefix]
```

**功能**：
- 创建：`thumbnails.jpg`（或大型演示文稿的 `thumbnails-1.jpg`、`thumbnails-2.jpg` 等）
- 默认：5 列，每个网格最多 30 张幻灯片（5x6）
- 自定义前缀：`python scripts/thumbnail.py template.pptx my-grid`
- 调整列数：`--cols 4`（范围：3-6，影响每网格幻灯片数）
- 网格限制：3 列 = 12 张/网格，4 列 = 20 张，5 列 = 30 张，6 列 = 42 张
- 幻灯片从零开始索引（Slide 0、Slide 1 等）

**用例**：
- 模板分析：快速理解幻灯片版式和设计模式
- 内容审查：整个演示文稿的视觉概览
- 导航参考：通过视觉外观找到特定幻灯片
- 质量检查：验证所有幻灯片格式正确

## 将幻灯片转换为图像

要视觉分析 PowerPoint 幻灯片，通过两步过程转换为图像：

1. **将 PPTX 转换为 PDF**：
   ```bash
   soffice --headless --convert-to pdf template.pptx
   ```

2. **将 PDF 页面转换为 JPEG 图像**：
   ```bash
   pdftoppm -jpeg -r 150 template.pdf slide
   ```
   这会创建 `slide-1.jpg`、`slide-2.jpg` 等文件。

## 代码风格指南
**重要**：生成 PPTX 操作代码时：
- 编写简洁代码
- 避免冗长的变量名和多余操作
- 避免不必要的打印语句

## 依赖

所需依赖（应已安装）：

- **markitdown**：`pip install "markitdown[pptx]"`（用于从演示文稿提取文本）
- **pptxgenjs**：`npm install -g pptxgenjs`（通过 html2pptx 创建演示文稿）
- **playwright**：`npm install -g playwright`（用于 html2pptx 中的 HTML 渲染）
- **react-icons**：`npm install -g react-icons react react-dom`（用于图标）
- **sharp**：`npm install -g sharp`（用于 SVG 光栅化和图像处理）
- **LibreOffice**：`sudo apt-get install libreoffice`（用于 PDF 转换）
- **Poppler**：`sudo apt-get install poppler-utils`（用于 pdftoppm 将 PDF 转换为图像）
- **defusedxml**：`pip install defusedxml`（用于安全 XML 解析）
