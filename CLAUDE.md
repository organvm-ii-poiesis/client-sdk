# CLAUDE.md — client-sdk

**ORGAN II** (Art) · `organvm-ii-poiesis/client-sdk`
**Status:** ACTIVE · **Branch:** `main`

## What This Repo Is

WebSocket client library for audience vote submission in Omni-Dromenon-Engine

## Stack

**Languages:** TypeScript
**Build:** npm
**Testing:** Node test runner (likely)

## Directory Structure

```
📁 .github/
📁 docs/
    adr
📁 src/
    client.ts
    events.ts
    index.ts
📁 tests/
    client.test.ts
    events.test.ts
  .DS_Store
  .gitignore
  CHANGELOG.md
  LICENSE
  README.md
  package.json
  seed.yaml
  tsconfig.json
```

## Key Files

- `README.md` — Project documentation
- `package.json` — Dependencies and scripts
- `seed.yaml` — ORGANVM orchestration metadata
- `src/` — Main source code
- `tests/` — Test suite

## Development

```bash
npm install     # Install dependencies
npm run build   # Build
npm test        # Run tests
```

## ORGANVM Context

This repository is part of the **ORGANVM** eight-organ creative-institutional system.
It belongs to **ORGAN II (Art)** under the `organvm-ii-poiesis` GitHub organization.

**Dependencies:**
- organvm-ii-poiesis/metasystem-master

**Registry:** [`registry-v2.json`](https://github.com/meta-organvm/organvm-corpvs-testamentvm/blob/main/registry-v2.json)
**Corpus:** [`organvm-corpvs-testamentvm`](https://github.com/meta-organvm/organvm-corpvs-testamentvm)
