> Source: [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa

# Common Design Patterns

## Overview

Language-agnostic design patterns for consistent architecture. Covers skeleton project usage, the repository pattern, and standardized API response formats.

## Skeleton Projects

When implementing new functionality:
1. Search for battle-tested skeleton projects
2. Use parallel agents to evaluate options:
   - Security assessment
   - Extensibility analysis
   - Relevance scoring
   - Implementation planning
3. Clone best match as foundation
4. Iterate within proven structure

## Repository Pattern

Encapsulate data access behind a consistent interface:
- Define standard operations: `findAll`, `findById`, `create`, `update`, `delete`
- Concrete implementations handle storage details (database, API, file, etc.)
- Business logic depends on the abstract interface, not the storage mechanism
- Enables easy swapping of data sources and simplifies testing with mocks

## API Response Format

Use a consistent envelope for all API responses:
- Success/status indicator
- Data payload (nullable on error)
- Error message field (nullable on success)
- Metadata for paginated responses (total, page, limit)
