> Source: [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | Category: Multimedia & Other

---
name: video-downloader
description: Downloads YouTube videos with customizable quality and format options, including audio-only MP3 extraction.
---

# YouTube Video Downloader

## Overview

This skill downloads YouTube videos with full control over quality and format settings. It supports multiple quality levels from 360p to best available, output formats including MP4, WebM, and MKV, and audio-only downloads as MP3. It uses `yt-dlp` under the hood, which it installs automatically if not present.

## Quick Start

```bash
python scripts/download_video.py "https://www.youtube.com/watch?v=VIDEO_ID"
```

Downloads the video in best available quality as MP4 to `/mnt/user-data/outputs/`.

## Options

### Quality Settings

Use `-q` or `--quality`:

| Setting | Description |
|---------|-------------|
| `best` | Highest quality available (default) |
| `1080p` | Full HD |
| `720p` | HD |
| `480p` | Standard definition |
| `360p` | Lower quality |
| `worst` | Lowest quality available |

```bash
python scripts/download_video.py "URL" -q 720p
```

### Format Options

Use `-f` or `--format` (video downloads only):

| Format | Description |
|--------|-------------|
| `mp4` | Most compatible (default) |
| `webm` | Modern format |
| `mkv` | Matroska container |

```bash
python scripts/download_video.py "URL" -f webm
```

### Audio Only

Use `-a` or `--audio-only` to download audio as MP3:

```bash
python scripts/download_video.py "URL" -a
```

### Custom Output Directory

Use `-o` or `--output`:

```bash
python scripts/download_video.py "URL" -o /path/to/directory
```

## Complete Examples

Download video in 1080p as MP4:
```bash
python scripts/download_video.py "https://www.youtube.com/watch?v=dQw4w9WgXcQ" -q 1080p
```

Download audio only as MP3:
```bash
python scripts/download_video.py "https://www.youtube.com/watch?v=dQw4w9WgXcQ" -a
```

Download in 720p as WebM to a custom directory:
```bash
python scripts/download_video.py "https://www.youtube.com/watch?v=dQw4w9WgXcQ" -q 720p -f webm -o /custom/path
```

## How It Works

The skill uses `yt-dlp`, a robust YouTube downloader that:
- Automatically installs itself if not present
- Fetches video information before downloading
- Selects the best available streams matching your criteria
- Merges video and audio streams when needed
- Supports a wide range of YouTube video formats

## Important Notes

- Downloads are saved to `/mnt/user-data/outputs/` by default
- Video filename is automatically generated from the video title
- The script handles installation of yt-dlp automatically
- Only single videos are downloaded (playlists are skipped by default)
- Higher quality videos may take longer to download and use more disk space
