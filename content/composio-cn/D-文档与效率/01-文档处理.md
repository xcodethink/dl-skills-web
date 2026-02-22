> 来源：[ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | 分类：文档与效率

# 文档处理技能（Document Skills）

本技能提供全面的文档处理能力，涵盖三种主要的 Office 文档格式：DOCX（Word 文档）、PDF 和 PPTX（PowerPoint 演示文稿）。支持创建、编辑、分析、格式转换等操作。

---

## 一、DOCX 创建、编辑与分析

### 概述

用户可能要求你创建、编辑或分析 .docx 文件的内容。.docx 文件本质上是一个包含 XML 文件和其他资源的 ZIP 归档，你可以读取或编辑这些内容。不同的任务有不同的工具和工作流可用。

### 工作流决策树

#### 读取/分析内容
使用下方的"文本提取"或"原始 XML 访问"部分

#### 创建新文档
使用"创建新 Word 文档"工作流

#### 编辑现有文档
- **自己的文档 + 简单修改**：使用"基础 OOXML 编辑"工作流
- **他人的文档**：使用 **"批注修订（Redlining）工作流"**（推荐默认方式）
- **法律、学术、商业或政府文档**：使用 **"批注修订工作流"**（必须）

### 读取和分析内容

#### 文本提取
如果你只需要读取文档的文本内容，应使用 pandoc 将文档转换为 Markdown。Pandoc 对保持文档结构有出色的支持，并可以显示修订跟踪：

```bash
# 将文档转换为 Markdown 并保留修订记录
pandoc --track-changes=all path-to-file.docx -o output.md
# 选项：--track-changes=accept/reject/all（接受/拒绝/全部）
```

#### 原始 XML 访问
以下功能需要原始 XML 访问：批注、复杂格式、文档结构、嵌入媒体和元数据。对于这些功能，需要解包文档并读取其原始 XML 内容。

**解包文件**：
```bash
python ooxml/scripts/unpack.py <office文件> <输出目录>
```

**关键文件结构**：
* `word/document.xml` - 主文档内容
* `word/comments.xml` - document.xml 中引用的批注
* `word/media/` - 嵌入的图片和媒体文件
* 修订跟踪使用 `<w:ins>`（插入）和 `<w:del>`（删除）标签

### 创建新 Word 文档

从头创建新 Word 文档时，使用 **docx-js**，它允许你使用 JavaScript/TypeScript 创建 Word 文档。

**工作流**：
1. **必须——完整阅读文件**：阅读 `docx-js.md`（约 500 行），了解详细语法、关键格式规则和最佳实践
2. 使用 Document、Paragraph、TextRun 组件创建 JavaScript/TypeScript 文件
3. 使用 `Packer.toBuffer()` 导出为 .docx

### 编辑现有 Word 文档

编辑现有 Word 文档时，使用 **Document library**（文档库，用于 OOXML 操作的 Python 库）。

**工作流**：
1. **必须——完整阅读文件**：阅读 `ooxml.md`（约 600 行），了解 Document library API 和直接编辑文档文件的 XML 模式
2. 解包文档：`python ooxml/scripts/unpack.py <office文件> <输出目录>`
3. 使用 Document library 创建并运行 Python 脚本
4. 打包最终文档：`python ooxml/scripts/pack.py <输入目录> <office文件>`

### 批注修订（Redlining）工作流

此工作流允许你在实施前使用 Markdown 规划全面的修订跟踪。**关键原则：最小化、精确的编辑** —— 只标记实际变更的文本。

**批处理策略**：将相关更改分组为 3-10 个更改的批次。

**示例 —— 将"30 days"改为"60 days"**：
```python
# 错误做法 - 替换整个句子
'<w:del>..整句..</w:del><w:ins>..整句..</w:ins>'

# 正确做法 - 只标记变更部分，保留未更改文本的原始 <w:r>
'<w:r>..The term is ..</w:r><w:del>..30..</w:del><w:ins>..60..</w:ins><w:r>.. days..</w:r>'
```

**完整工作流步骤**：
1. 获取 Markdown 表示：`pandoc --track-changes=all file.docx -o current.md`
2. 识别和分组更改
3. 阅读文档并解包
4. 分批实施更改
5. 打包文档
6. 最终验证

### 文档转图片

将 Word 文档转换为图片进行可视化分析：

```bash
# 步骤 1：DOCX 转 PDF
soffice --headless --convert-to pdf document.docx

# 步骤 2：PDF 页面转 JPEG 图片
pdftoppm -jpeg -r 150 document.pdf page
# 生成 page-1.jpg、page-2.jpg 等
```

### 依赖项

- **pandoc**：`sudo apt-get install pandoc`（文本提取）
- **docx**：`npm install -g docx`（创建新文档）
- **LibreOffice**：`sudo apt-get install libreoffice`（PDF 转换）
- **Poppler**：`sudo apt-get install poppler-utils`（PDF 转图片）
- **defusedxml**：`pip install defusedxml`（安全 XML 解析）

---

## 二、PDF 处理指南

### 概述

涵盖使用 Python 库和命令行工具进行的基本 PDF 处理操作。如需填写 PDF 表单，请阅读 forms.md 并按其说明操作。

### 快速开始

```python
from pypdf import PdfReader, PdfWriter

# 读取 PDF
reader = PdfReader("document.pdf")
print(f"页数：{len(reader.pages)}")

# 提取文本
text = ""
for page in reader.pages:
    text += page.extract_text()
```

### Python 库

#### pypdf - 基本操作

**合并 PDF**：
```python
from pypdf import PdfWriter, PdfReader

writer = PdfWriter()
for pdf_file in ["doc1.pdf", "doc2.pdf", "doc3.pdf"]:
    reader = PdfReader(pdf_file)
    for page in reader.pages:
        writer.add_page(page)

with open("merged.pdf", "wb") as output:
    writer.write(output)
```

**拆分 PDF**：
```python
reader = PdfReader("input.pdf")
for i, page in enumerate(reader.pages):
    writer = PdfWriter()
    writer.add_page(page)
    with open(f"page_{i+1}.pdf", "wb") as output:
        writer.write(output)
```

**提取元数据**：
```python
reader = PdfReader("document.pdf")
meta = reader.metadata
print(f"标题：{meta.title}")
print(f"作者：{meta.author}")
```

**旋转页面**：
```python
reader = PdfReader("input.pdf")
writer = PdfWriter()
page = reader.pages[0]
page.rotate(90)  # 顺时针旋转 90 度
writer.add_page(page)
with open("rotated.pdf", "wb") as output:
    writer.write(output)
```

#### pdfplumber - 文本和表格提取

**提取带布局的文本**：
```python
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        print(text)
```

**提取表格**：
```python
with pdfplumber.open("document.pdf") as pdf:
    for i, page in enumerate(pdf.pages):
        tables = page.extract_tables()
        for j, table in enumerate(tables):
            print(f"第 {i+1} 页的表格 {j+1}：")
            for row in table:
                print(row)
```

**高级表格提取（导出到 Excel）**：
```python
import pandas as pd

with pdfplumber.open("document.pdf") as pdf:
    all_tables = []
    for page in pdf.pages:
        tables = page.extract_tables()
        for table in tables:
            if table:  # 检查表格是否非空
                df = pd.DataFrame(table[1:], columns=table[0])
                all_tables.append(df)

# 合并所有表格
if all_tables:
    combined_df = pd.concat(all_tables, ignore_index=True)
    combined_df.to_excel("extracted_tables.xlsx", index=False)
```

#### reportlab - 创建 PDF

```python
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

c = canvas.Canvas("hello.pdf", pagesize=letter)
width, height = letter
c.drawString(100, height - 100, "Hello World!")
c.save()
```

### 命令行工具

```bash
# pdftotext（poppler-utils）- 提取文本
pdftotext input.pdf output.txt
pdftotext -layout input.pdf output.txt  # 保留布局

# qpdf - 合并 PDF
qpdf --empty --pages file1.pdf file2.pdf -- merged.pdf

# qpdf - 拆分页面
qpdf input.pdf --pages . 1-5 -- pages1-5.pdf

# qpdf - 旋转页面
qpdf input.pdf output.pdf --rotate=+90:1
```

### 常见任务

**扫描 PDF 的 OCR（光学字符识别）**：
```python
# 需要：pip install pytesseract pdf2image
import pytesseract
from pdf2image import convert_from_path

images = convert_from_path('scanned.pdf')
text = ""
for i, image in enumerate(images):
    text += f"第 {i+1} 页：\n"
    text += pytesseract.image_to_string(image)
    text += "\n\n"
```

**添加水印**：
```python
from pypdf import PdfReader, PdfWriter

watermark = PdfReader("watermark.pdf").pages[0]
reader = PdfReader("document.pdf")
writer = PdfWriter()

for page in reader.pages:
    page.merge_page(watermark)
    writer.add_page(page)

with open("watermarked.pdf", "wb") as output:
    writer.write(output)
```

**密码保护**：
```python
from pypdf import PdfReader, PdfWriter

reader = PdfReader("input.pdf")
writer = PdfWriter()
for page in reader.pages:
    writer.add_page(page)
writer.encrypt("userpassword", "ownerpassword")
with open("encrypted.pdf", "wb") as output:
    writer.write(output)
```

### 快速参考

| 任务 | 最佳工具 | 命令/代码 |
|------|-----------|-----------|
| 合并 PDF | pypdf | `writer.add_page(page)` |
| 拆分 PDF | pypdf | 每页一个文件 |
| 提取文本 | pdfplumber | `page.extract_text()` |
| 提取表格 | pdfplumber | `page.extract_tables()` |
| 创建 PDF | reportlab | Canvas 或 Platypus |
| 命令行合并 | qpdf | `qpdf --empty --pages ...` |
| OCR 扫描 PDF | pytesseract | 先转换为图片 |
| 填写 PDF 表单 | pdf-lib 或 pypdf | 见 forms.md |

---

## 三、PPTX 创建、编辑与分析

### 概述

用户可能要求你创建、编辑或分析 .pptx 文件的内容。.pptx 文件本质上也是一个包含 XML 文件和其他资源的 ZIP 归档。

### 读取和分析内容

**文本提取**：
```bash
# 使用 markitdown 将演示文稿转换为 Markdown
python -m markitdown path-to-file.pptx
```

**原始 XML 访问** —— 关键文件结构：
* `ppt/presentation.xml` - 主演示文稿元数据和幻灯片引用
* `ppt/slides/slide{N}.xml` - 各幻灯片内容
* `ppt/notesSlides/notesSlide{N}.xml` - 各幻灯片的演讲备注
* `ppt/comments/` - 幻灯片批注
* `ppt/slideLayouts/` - 布局模板
* `ppt/slideMasters/` - 母版幻灯片模板
* `ppt/theme/` - 主题和样式信息
* `ppt/media/` - 图片和其他媒体文件

### 创建新演示文稿（无模板）

使用 **html2pptx** 工作流，将 HTML 幻灯片转换为 PowerPoint 并精确定位。

#### 设计原则

**关键要求**：
- 在编写代码前说明内容驱动的设计方法
- 仅使用网页安全字体：Arial、Helvetica、Times New Roman、Georgia、Courier New、Verdana、Tahoma、Trebuchet MS、Impact
- 通过大小、粗细和颜色创建清晰的视觉层次
- 确保可读性：强对比度、适当的文字大小、整洁的对齐
- 保持一致性：在幻灯片间重复模式、间距和视觉语言

#### 配色方案选择

创意选择颜色时的考虑维度：
- 主题、行业、情绪、能量水平、目标受众、品牌识别
- 构建调色板：选择 3-5 个协调的颜色（主色 + 辅助色 + 强调色）
- 确保对比度：文字在背景上必须清晰可读

**示例配色方案**：
1. **经典蓝**：深海军蓝 (#1C2833)、石板灰 (#2E4053)、银色 (#AAB7B8)
2. **青绿与珊瑚**：青绿 (#5EA8A7)、珊瑚红 (#FE4447)
3. **黑金**：金色 (#BF9A4A)、黑色 (#000000)、奶油色 (#F4F6F6)
4. **森林绿**：黑色 (#191A19)、绿色 (#4E9F3D)、深绿 (#1E5128)

#### 布局提示
- **双列布局（推荐）**：全宽标题，下方两列——文本在一列，图表/表格在另一列
- **全幻灯片布局**：让主要内容占据整个幻灯片以获得最大影响力
- **绝不垂直堆叠**：不要在单列中将图表/表格放在文本下方

#### 工作流
1. 阅读 `html2pptx.md` 了解详细语法和规则
2. 为每张幻灯片创建适当尺寸的 HTML 文件（如 16:9 为 720pt x 405pt）
3. 使用 `html2pptx()` 函数转换 HTML 幻灯片为 PowerPoint
4. 生成缩略图并检查布局问题

### 编辑现有演示文稿

**工作流**：
1. 阅读 `ooxml.md` 了解 OOXML 结构和编辑工作流
2. 解包：`python ooxml/scripts/unpack.py <pptx文件> <输出目录>`
3. 编辑 XML 文件
4. **关键**：每次编辑后立即验证：`python ooxml/scripts/validate.py <目录> --original <文件>`
5. 打包：`python ooxml/scripts/pack.py <输入目录> <pptx文件>`

### 基于模板创建演示文稿

**工作流**：
1. 提取模板文本并创建缩略图网格进行分析
2. 分析模板并保存清单到 `template-inventory.md`
3. 基于模板清单创建演示文稿大纲
4. 使用 `rearrange.py` 复制、重排和删除幻灯片
5. 使用 `inventory.py` 提取所有文本
6. 生成替换文本并保存到 JSON
7. 使用 `replace.py` 应用替换

### 创建缩略图网格

```bash
python scripts/thumbnail.py template.pptx [输出前缀]
```

特性：
- 默认 5 列，每网格最多 30 张幻灯片（5x6）
- 可调列数：`--cols 4`（范围：3-6）
- 幻灯片从零索引开始

### 幻灯片转图片

```bash
# 步骤 1：PPTX 转 PDF
soffice --headless --convert-to pdf template.pptx

# 步骤 2：PDF 页面转 JPEG
pdftoppm -jpeg -r 150 template.pdf slide
```

### 依赖项

- **markitdown**：`pip install "markitdown[pptx]"`（文本提取）
- **pptxgenjs**：`npm install -g pptxgenjs`（创建演示文稿）
- **playwright**：`npm install -g playwright`（HTML 渲染）
- **sharp**：`npm install -g sharp`（SVG 光栅化和图片处理）
- **LibreOffice**：PDF 转换
- **Poppler**：PDF 转图片
- **defusedxml**：`pip install defusedxml`（安全 XML 解析）

---

## 代码风格指南

**重要**：生成文档操作代码时：
- 编写简洁的代码
- 避免冗长的变量名和多余的操作
- 避免不必要的 print 语句
