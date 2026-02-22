> 来源：[mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) | 分类：E-AI与Agent

# AI 多模态处理技能

使用 Google Gemini 的多模态 API 处理音频、图像、视频、文档，以及生成图像。为所有多媒体内容理解和生成提供统一接口。

## 核心能力

### 音频处理
- 带时间戳的转录（最长 9.5 小时）
- 音频摘要与分析
- 语音理解与说话人识别
- 音乐与环境声音分析
- 文字转语音（TTS）生成，可控制语音

### 图像理解
- 图像字幕与描述
- 目标检测与边界框（2.0+）
- 像素级分割（2.5+）
- 视觉问答
- 多图对比（最多 3,600 张图像）
- OCR 与文字提取

### 视频分析
- 场景检测与摘要
- 带时间理解的视频问答
- 带视觉描述的转录
- YouTube URL 支持
- 长视频处理（最长 6 小时）
- 帧级分析

### 文档提取
- 原生 PDF 视觉处理（最多 1,000 页）
- 表格与表单提取
- 图表与图解分析
- 多页文档理解
- 结构化数据输出（JSON Schema）
- 格式转换（PDF 转 HTML/JSON）

### 图像生成
- 文本生成图像
- 图像编辑与修改
- 多图合成（最多 3 张图像）
- 迭代优化
- 多种宽高比（1:1、16:9、9:16、4:3、3:4）
- 可控风格与质量

## 能力矩阵

| 任务 | 音频 | 图像 | 视频 | 文档 | 生成 |
|------|:----:|:----:|:----:|:----:|:----:|
| 转录 | ✓ | - | ✓ | - | - |
| 摘要 | ✓ | ✓ | ✓ | ✓ | - |
| 问答 | ✓ | ✓ | ✓ | ✓ | - |
| 目标检测 | - | ✓ | ✓ | - | - |
| 文字提取 | - | ✓ | - | ✓ | - |
| 结构化输出 | ✓ | ✓ | ✓ | ✓ | - |
| 创建 | TTS | - | - | - | ✓ |
| 时间戳 | ✓ | - | ✓ | - | - |
| 分割 | - | ✓ | - | - | - |

## 模型选择指南

### Gemini 2.5 系列（推荐）
- **gemini-2.5-pro**：最高质量，全部功能，1M-2M 上下文
- **gemini-2.5-flash**：最佳平衡，全部功能，1M-2M 上下文
- **gemini-2.5-flash-lite**：轻量级，支持分割
- **gemini-2.5-flash-image**：仅图像生成

### Gemini 2.0 系列
- **gemini-2.0-flash**：快速处理，目标检测
- **gemini-2.0-flash-lite**：轻量级选项

### 功能要求
- **分割**：需要 2.5+ 模型
- **目标检测**：需要 2.0+ 模型
- **多视频**：需要 2.5+ 模型
- **图像生成**：需要 flash-image 模型

### 上下文窗口
- **2M tokens**：约 6 小时视频（低分辨率）或约 2 小时（默认）
- **1M tokens**：约 3 小时视频（低分辨率）或约 1 小时（默认）
- **音频**：32 tokens/秒（1 分钟 = 1,920 tokens）
- **PDF**：258 tokens/页（固定）
- **图像**：258-1,548 tokens（根据尺寸）

## 快速开始

### 前置条件

**API 密钥设置**：支持 Google AI Studio 和 Vertex AI。

技能按以下顺序检查 `GEMINI_API_KEY`：
1. 进程环境变量：`export GEMINI_API_KEY="your-key"`
2. 项目根目录：`.env`
3. `.claude/.env`
4. `.claude/skills/.env`
5. `.claude/skills/ai-multimodal/.env`

**获取 API 密钥**：https://aistudio.google.com/apikey

**Vertex AI 配置**：
```bash
export GEMINI_USE_VERTEX=true
export VERTEX_PROJECT_ID=your-gcp-project-id
export VERTEX_LOCATION=us-central1  # 可选
```

**安装 SDK**：
```bash
pip install google-genai python-dotenv pillow
```

### 常用模式

**转录音频**：
```bash
python scripts/gemini_batch_process.py \
  --files audio.mp3 \
  --task transcribe \
  --model gemini-2.5-flash
```

**分析图像**：
```bash
python scripts/gemini_batch_process.py \
  --files image.jpg \
  --task analyze \
  --prompt "描述这张图片" \
  --output docs/assets/<output-name>.md \
  --model gemini-2.5-flash
```

**处理视频**：
```bash
python scripts/gemini_batch_process.py \
  --files video.mp4 \
  --task analyze \
  --prompt "总结关键要点并附带时间戳" \
  --output docs/assets/<output-name>.md \
  --model gemini-2.5-flash
```

**从 PDF 提取**：
```bash
python scripts/gemini_batch_process.py \
  --files document.pdf \
  --task extract \
  --prompt "将表格数据提取为 JSON" \
  --output docs/assets/<output-name>.md \
  --format json
```

**生成图像**：
```bash
python scripts/gemini_batch_process.py \
  --task generate \
  --prompt "日落时分的未来城市" \
  --output docs/assets/<output-file-name> \
  --model gemini-2.5-flash-image \
  --aspect-ratio 16:9
```

**优化媒体**：
```bash
# 准备大型视频以供处理
python scripts/media_optimizer.py \
  --input large-video.mp4 \
  --output docs/assets/<output-file-name> \
  --target-size 100MB

# 批量优化多个文件
python scripts/media_optimizer.py \
  --input-dir ./videos \
  --output-dir docs/assets/optimized \
  --quality 85
```

**将文档转换为 Markdown**：
```bash
# 转换为 PDF
python scripts/document_converter.py \
  --input document.docx \
  --output docs/assets/document.md

# 提取指定页面
python scripts/document_converter.py \
  --input large.pdf \
  --output docs/assets/chapter1.md \
  --pages 1-20
```

## 支持的格式

### 音频
- WAV、MP3、AAC、FLAC、OGG Vorbis、AIFF
- 每次请求最长 9.5 小时
- 自动降采样至 16 Kbps 单声道

### 图像
- PNG、JPEG、WEBP、HEIC、HEIF
- 每次请求最多 3,600 张图像
- 分辨率：≤384px = 258 tokens，更大则分块

### 视频
- MP4、MPEG、MOV、AVI、FLV、MPG、WebM、WMV、3GPP
- 最长 6 小时（低分辨率）或 2 小时（默认）
- 支持 YouTube URL（仅公开视频）

### 文档
- 仅 PDF 支持视觉处理
- 最多 1,000 页
- 支持 TXT、HTML、Markdown（仅文本）

### 大小限制
- **内联**：<20MB 总请求
- **文件 API**：每文件 2GB，项目配额 20GB
- **保留时间**：48 小时自动删除

## 参考导航

详细实现指南请参见：

### 音频处理
- `references/audio-processing.md` - 转录、分析、TTS
  - 时间戳处理与片段分析
  - 多说话人识别
  - 非语音音频分析
  - 文字转语音生成

### 图像理解
- `references/vision-understanding.md` - 字幕、检测、OCR
  - 目标检测与定位
  - 像素级分割
  - 视觉问答
  - 多图对比

### 视频分析
- `references/video-analysis.md` - 场景检测、时间理解
  - YouTube URL 处理
  - 基于时间戳的查询
  - 视频剪辑与帧率控制
  - 长视频优化

### 文档提取
- `references/document-extraction.md` - PDF 处理、结构化输出
  - 表格与表单提取
  - 图表与图解分析
  - JSON Schema 验证
  - 多页处理

### 图像生成
- `references/image-generation.md` - 文生图、编辑
  - 提示词工程策略
  - 图像编辑与合成
  - 宽高比选择
  - 安全设置

## 成本优化

### Token 费用
**输入定价**：
- Gemini 2.5 Flash：$1.00/1M 输入，$0.10/1M 输出
- Gemini 2.5 Pro：$3.00/1M 输入，$12.00/1M 输出
- Gemini 1.5 Flash：$0.70/1M 输入，$0.175/1M 输出

**Token 速率**：
- 音频：32 tokens/秒（1 分钟 = 1,920 tokens）
- 视频：约 300 tokens/秒（默认）或约 100（低分辨率）
- PDF：258 tokens/页（固定）
- 图像：258-1,548 tokens（根据尺寸）

**TTS 定价**：
- Flash TTS：$10/1M tokens
- Pro TTS：$20/1M tokens

### 最佳实践
1. 大多数任务使用 `gemini-2.5-flash`（最佳性价比）
2. 大于 20MB 的文件或重复查询使用文件 API
3. 上传前优化媒体（参见 `media_optimizer.py`）
4. 处理特定片段而非完整视频
5. 静态内容使用较低帧率
6. 对重复查询实施上下文缓存
7. 并行批量处理多个文件

## 速率限制

**免费层级**：
- 10-15 RPM（每分钟请求数）
- 1M-4M TPM（每分钟 token 数）
- 1,500 RPD（每天请求数）

**YouTube 限制**：
- 免费层级：每天 8 小时
- 付费层级：无时长限制
- 仅限公开视频

**存储限制**：
- 每项目 20GB
- 每文件 2GB
- 48 小时保留

## 错误处理

常见错误及解决方案：
- **400**：无效格式/大小 - 上传前验证
- **401**：无效 API 密钥 - 检查配置
- **403**：权限拒绝 - 验证 API 密钥限制
- **404**：文件未找到 - 确保文件已上传且处于活跃状态
- **429**：速率限制超出 - 实施指数退避
- **500**：服务器错误 - 带退避重试

## 脚本概览

所有脚本支持统一的 API 密钥检测和错误处理：

**gemini_batch_process.py**：批量处理多个媒体文件
- 支持所有模态（音频、图像、视频、PDF）
- 进度跟踪与错误恢复
- 输出格式：JSON、Markdown、CSV
- 速率限制与重试逻辑
- 试运行模式

**media_optimizer.py**：为 Gemini API 准备媒体
- 压缩视频/音频以符合大小限制
- 适当调整图像大小
- 将长视频分割成块
- 格式转换
- 质量与大小优化

**document_converter.py**：将文档转换为 PDF
- 将 DOCX、XLSX、PPTX 转换为 PDF
- 提取页面范围
- 为 Gemini 优化 PDF
- 从 PDF 中提取图像
- 批量转换支持

运行任何脚本时加 `--help` 可查看详细用法。

## 资源

- [音频 API 文档](https://ai.google.dev/gemini-api/docs/audio)
- [图像 API 文档](https://ai.google.dev/gemini-api/docs/image-understanding)
- [视频 API 文档](https://ai.google.dev/gemini-api/docs/video-understanding)
- [文档 API 文档](https://ai.google.dev/gemini-api/docs/document-processing)
- [图像生成文档](https://ai.google.dev/gemini-api/docs/image-generation)
- [获取 API 密钥](https://aistudio.google.com/apikey)
- [定价](https://ai.google.dev/pricing)
