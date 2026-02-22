> 来源：[mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | 分类：H-文档处理

# DOCX 创建、编辑和分析

## 概述

用户可能要求你创建、编辑或分析 .docx 文件的内容。.docx 文件本质上是一个包含 XML 文件和其他资源的 ZIP 归档，你可以读取或编辑。针对不同任务有不同的工具和工作流。

## 工作流决策树

### 读取/分析内容
使用下方的"文本提取"或"原始 XML 访问"部分

### 创建新文档
使用"创建新 Word 文档"工作流

### 编辑现有文档
- **自己的文档 + 简单更改**
  使用"基础 OOXML 编辑"工作流

- **他人的文档**
  使用**"批注修订工作流"**（推荐默认）

- **法律、学术、商业或政府文档**
  使用**"批注修订工作流"**（必需）

## 读取和分析内容

### 文本提取
如果只需要读取文档的文本内容，应使用 pandoc 将文档转换为 Markdown。Pandoc 对保留文档结构有出色支持，并且可以显示修订记录：

```bash
# 将文档转换为 Markdown 并保留修订记录
pandoc --track-changes=all path-to-file.docx -o output.md
# 选项：--track-changes=accept/reject/all
```

### 原始 XML 访问
以下情况需要原始 XML 访问：批注、复杂格式、文档结构、嵌入媒体和元数据。对于这些功能，需要解包文档并读取原始 XML 内容。

#### 解包文件
`python ooxml/scripts/unpack.py <office_file> <output_directory>`

#### 关键文件结构
* `word/document.xml` - 主文档内容
* `word/comments.xml` - document.xml 中引用的批注
* `word/media/` - 嵌入的图像和媒体文件
* 修订记录使用 `<w:ins>`（插入）和 `<w:del>`（删除）标签

## 创建新 Word 文档

从头创建新 Word 文档时，使用 **docx-js**，它允许你使用 JavaScript/TypeScript 创建 Word 文档。

### 工作流
1. **必须 - 读取完整文件**：完整阅读 [`docx-js.md`](docx-js.md)（约 500 行），从头到尾。**读取此文件时绝不设置范围限制。** 在开始文档创建之前，读取完整文件内容以了解详细语法、关键格式规则和最佳实践。
2. 使用 Document、Paragraph、TextRun 组件创建 JavaScript/TypeScript 文件（可假设所有依赖已安装，如未安装请参考下方依赖部分）
3. 使用 Packer.toBuffer() 导出为 .docx

## 编辑现有 Word 文档

编辑现有 Word 文档时，使用 **Document 库**（用于 OOXML 操作的 Python 库）。该库自动处理基础设施设置并提供文档操作方法。对于复杂场景，可通过库直接访问底层 DOM。

### 工作流
1. **必须 - 读取完整文件**：完整阅读 [`ooxml.md`](ooxml.md)（约 600 行），从头到尾。**读取此文件时绝不设置范围限制。** 读取完整文件内容以了解 Document 库 API 和直接编辑文档文件的 XML 模式。
2. 解包文档：`python ooxml/scripts/unpack.py <office_file> <output_directory>`
3. 使用 Document 库创建并运行 Python 脚本（参见 ooxml.md 中的"Document Library"部分）
4. 打包最终文档：`python ooxml/scripts/pack.py <input_directory> <office_file>`

Document 库为常见操作提供高级方法，也支持直接 DOM 访问用于复杂场景。

## 文档审阅的批注修订工作流

此工作流允许你在实施 OOXML 之前使用 Markdown 规划全面的修订记录。**关键**：对于完整的修订记录，必须系统性地实施**所有**更改。

**批处理策略**：将相关更改分组为 3-10 个更改的批次。这使调试可管理同时保持效率。在进入下一批次之前测试每个批次。

**原则：最小化、精确的编辑**
实施修订记录时，只标记实际更改的文本。重复未更改的文本使编辑更难审阅且显得不专业。将替换拆分为：[未更改文本] + [删除] + [插入] + [未更改文本]。通过从原文中提取 `<w:r>` 元素并重用来保留原始运行的 RSID。

示例 - 将句子中的 "30 days" 改为 "60 days"：
```python
# 错误做法 - 替换整个句子
'<w:del><w:r><w:delText>The term is 30 days.</w:delText></w:r></w:del><w:ins><w:r><w:t>The term is 60 days.</w:t></w:r></w:ins>'

# 正确做法 - 只标记实际更改的部分，保留原始 <w:r> 用于未更改的文本
'<w:r w:rsidR="00AB12CD"><w:t>The term is </w:t></w:r><w:del><w:r><w:delText>30</w:delText></w:r></w:del><w:ins><w:r><w:t>60</w:t></w:r></w:ins><w:r w:rsidR="00AB12CD"><w:t> days.</w:t></w:r>'
```

### 修订记录工作流

1. **获取 Markdown 表示**：将文档转换为保留修订记录的 Markdown：
   ```bash
   pandoc --track-changes=all path-to-file.docx -o current.md
   ```

2. **识别并分组更改**：审阅文档并识别所有需要的更改，组织为逻辑批次：

   **定位方法**（在 XML 中查找更改位置）：
   - 节/标题编号（如"第 3.2 节"、"第四条"）
   - 段落标识符（如有编号）
   - 带唯一上下文文本的 grep 模式
   - 文档结构（如"第一段"、"签名块"）
   - **不要使用 Markdown 行号** - 它们不映射到 XML 结构

   **批次组织**（每批 3-10 个相关更改）：
   - 按节："批次 1：第 2 节修改"、"批次 2：第 5 节更新"
   - 按类型："批次 1：日期更正"、"批次 2：当事人名称更改"
   - 按复杂度：从简单文本替换开始，然后处理复杂结构更改
   - 按顺序："批次 1：第 1-3 页"、"批次 2：第 4-6 页"

3. **读取文档并解包**：
   - **必须 - 读取完整文件**：完整阅读 [`ooxml.md`](ooxml.md)（约 600 行）。特别注意"Document Library"和"Tracked Change Patterns"部分。
   - **解包文档**：`python ooxml/scripts/unpack.py <file.docx> <dir>`
   - **记录建议的 RSID**：解包脚本会建议一个用于修订记录的 RSID。复制此 RSID 供步骤 4b 使用。

4. **批量实施更改**：将更改按逻辑分组（按节、按类型或按位置），在单个脚本中一起实施。

   对每批相关更改：

   **a. 将文本映射到 XML**：在 `word/document.xml` 中 grep 文本以验证文本在 `<w:r>` 元素间的分布。

   **b. 创建并运行脚本**：使用 `get_node` 查找节点，实施更改，然后 `doc.save()`。参见 ooxml.md 中的 **"Document Library"** 部分了解模式。

   **说明**：在编写脚本之前始终立即 grep `word/document.xml` 以获取当前行号并验证文本内容。每次脚本运行后行号都会改变。

5. **打包文档**：所有批次完成后，将解包目录转换回 .docx：
   ```bash
   python ooxml/scripts/pack.py unpacked reviewed-document.docx
   ```

6. **最终验证**：对完整文档进行全面检查：
   - 将最终文档转换为 Markdown：
     ```bash
     pandoc --track-changes=all reviewed-document.docx -o verification.md
     ```
   - 验证所有更改已正确应用：
     ```bash
     grep "原始短语" verification.md  # 不应找到
     grep "替换短语" verification.md  # 应找到
     ```
   - 检查没有引入意外更改

## 将文档转换为图像

要视觉分析 Word 文档，通过两步过程转换为图像：

1. **将 DOCX 转换为 PDF**：
   ```bash
   soffice --headless --convert-to pdf document.docx
   ```

2. **将 PDF 页面转换为 JPEG 图像**：
   ```bash
   pdftoppm -jpeg -r 150 document.pdf page
   ```
   这会创建 `page-1.jpg`、`page-2.jpg` 等文件。

选项：
- `-r 150`：设置分辨率为 150 DPI（调整质量/大小平衡）
- `-jpeg`：输出 JPEG 格式（如需 PNG 可使用 `-png`）
- `-f N`：要转换的起始页（如 `-f 2` 从第 2 页开始）
- `-l N`：要转换的末页（如 `-l 5` 到第 5 页停止）
- `page`：输出文件前缀

特定范围示例：
```bash
pdftoppm -jpeg -r 150 -f 2 -l 5 document.pdf page  # 仅转换第 2-5 页
```

## 代码风格指南
**重要**：生成 DOCX 操作代码时：
- 编写简洁代码
- 避免冗长的变量名和多余操作
- 避免不必要的打印语句

## 依赖

所需依赖（如未安装请安装）：

- **pandoc**：`sudo apt-get install pandoc`（用于文本提取）
- **docx**：`npm install -g docx`（用于创建新文档）
- **LibreOffice**：`sudo apt-get install libreoffice`（用于 PDF 转换）
- **Poppler**：`sudo apt-get install poppler-utils`（用于 pdftoppm 将 PDF 转换为图像）
- **defusedxml**：`pip install defusedxml`（用于安全 XML 解析）
