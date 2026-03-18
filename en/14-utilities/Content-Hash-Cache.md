> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Content-Hash File Cache Pattern

## Overview

Cache expensive file processing results (PDF parsing, text extraction, image analysis) using SHA-256 content hashes as cache keys. Unlike path-based caching, this survives file moves/renames and auto-invalidates when content changes.

## Core Pattern

### 1. Content-Hash Based Cache Key

```python
def compute_file_hash(path: Path) -> str:
    """SHA-256 of file contents (chunked for large files)."""
    sha256 = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            sha256.update(chunk)
    return sha256.hexdigest()
```

**Why content hash?** File rename/move = cache hit. Content change = automatic invalidation. No index file needed.

### 2. File-Based Cache Storage

Each entry stored as `{hash}.json` — O(1) lookup, no index required.

### 3. Service Layer Wrapper (SRP)

Keep processing functions pure. Add caching as a separate service layer:

```python
def extract_with_cache(file_path, *, cache_enabled=True, cache_dir=Path(".cache")):
    if not cache_enabled:
        return extract_text(file_path)  # Pure function, no cache knowledge
    file_hash = compute_file_hash(file_path)
    cached = read_cache(cache_dir, file_hash)
    if cached is not None:
        return cached.document
    doc = extract_text(file_path)
    write_cache(cache_dir, CacheEntry(file_hash, str(file_path), doc))
    return doc
```

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| SHA-256 content hash | Path-independent, auto-invalidates on change |
| `{hash}.json` file naming | O(1) lookup, no index needed |
| Service layer wrapper | SRP: extraction stays pure, cache is separate |
| Corruption returns `None` | Graceful degradation, re-processes on next run |

## Best Practices

- Hash content, not paths — paths change, content identity doesn't
- Chunk large files when hashing — avoid loading entire files into memory
- Keep processing functions pure — they should know nothing about caching
- Log cache hit/miss with truncated hashes for debugging
- Handle corruption gracefully — treat invalid cache entries as misses

## Anti-Patterns

- Path-based caching (breaks on file move/rename)
- Adding cache logic inside processing functions (SRP violation)
- Using `dataclasses.asdict()` with nested frozen dataclasses (use manual serialization)

## When to Use / When NOT to Use

**Use for:** File processing pipelines, CLI tools with `--cache/--no-cache`, batch processing with repeated files.

**Avoid for:** Real-time data that must always be fresh, extremely large cache entries (use streaming), results depending on parameters beyond file content.
