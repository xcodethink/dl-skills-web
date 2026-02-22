> 来源：[bear2u/my-skills](https://github.com/bear2u/my-skills) | 分类：F-工具与效率

# Logo 去除工具（Gemini Logo Remover）

使用 OpenCV 图像修复（Inpainting）技术去除 AI 生成图片中的 Gemini Logo 和水印。

## 安装

```bash
pip install opencv-python numpy pillow --break-system-packages
```

## 使用方法

### 按坐标去除

```python
import cv2
import numpy as np

def remove_region(input_path, output_path, x1, y1, x2, y2, radius=5):
    """使用图像修复技术去除矩形区域。"""
    img = cv2.imread(input_path)
    h, w = img.shape[:2]

    mask = np.zeros((h, w), dtype=np.uint8)
    cv2.rectangle(mask, (x1, y1), (x2, y2), 255, -1)

    result = cv2.inpaint(img, mask, radius, cv2.INPAINT_TELEA)
    cv2.imwrite(output_path, result)

# 示例：去除指定坐标处的区域
remove_region('/mnt/user-data/uploads/img.png',
              '/mnt/user-data/outputs/clean.png',
              x1=700, y1=650, x2=800, y2=720)
```

### 按角落去除

```python
def remove_corner_logo(input_path, output_path, corner='bottom_right',
                       w_ratio=0.1, h_ratio=0.1, padding=10):
    """从角落去除 Logo。corner 可选：top_left, top_right, bottom_left, bottom_right"""
    img = cv2.imread(input_path)
    h, w = img.shape[:2]

    lw, lh = int(w * w_ratio), int(h * h_ratio)

    coords = {
        'bottom_right': (w - lw - padding, h - lh - padding, w - padding, h - padding),
        'bottom_left': (padding, h - lh - padding, lw + padding, h - padding),
        'top_right': (w - lw - padding, padding, w - padding, lh + padding),
        'top_left': (padding, padding, lw + padding, lh + padding)
    }
    x1, y1, x2, y2 = coords[corner]

    mask = np.zeros((h, w), dtype=np.uint8)
    cv2.rectangle(mask, (x1, y1), (x2, y2), 255, -1)

    result = cv2.inpaint(img, mask, 5, cv2.INPAINT_TELEA)
    cv2.imwrite(output_path, result)

# 示例：去除右下角 Logo
remove_corner_logo('/mnt/user-data/uploads/img.png',
                   '/mnt/user-data/outputs/no_logo.png',
                   corner='bottom_right', w_ratio=0.08, h_ratio=0.08)
```

### 查找坐标

```python
img = cv2.imread(input_path)
h, w = img.shape[:2]
print(f"尺寸：{w}x{h}")

# Gemini 星形 Logo 通常位于图片右下角略内侧
# 常见坐标：x1=w-150, y1=h-100, x2=w-130, y2=h-55
# 具体位置因图片而异，需要调整
```

## 输出

始终保存到 `/mnt/user-data/outputs/` 并使用 `present_files` 工具。

## 注意事项

- 图像修复对背景均匀的小区域效果最好
- Gemini Logo 通常位于右下角
- 根据实际 Logo 位置和尺寸调整坐标/比例
