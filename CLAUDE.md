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

<!-- ORGANVM:AUTO:START -->
## System Context (auto-generated — do not edit)

**Organ:** ORGAN-II (Art) | **Tier:** standard | **Status:** CANDIDATE
**Org:** `unknown` | **Repo:** `client-sdk`

### Edges
- **Consumes** ← `organvm-ii-poiesis/metasystem-master`: unknown

### Siblings in Art
`core-engine`, `performance-sdk`, `example-generative-music`, `metasystem-master`, `example-choreographic-interface`, `showcase-portfolio`, `archive-past-works`, `case-studies-methodology`, `learning-resources`, `example-generative-visual`, `example-interactive-installation`, `example-ai-collaboration`, `docs`, `a-mavs-olevm`, `a-i-council--coliseum` ... and 14 more

### Governance
- Consumes Theory (I) concepts, produces artifacts for Commerce (III).

*Last synced: 2026-02-24T12:41:28Z*
<!-- ORGANVM:AUTO:END -->


## ⚡ Conductor OS Integration
This repository is a managed component of the ORGANVM meta-workspace.
- **Orchestration:** Use `conductor patch` for system status and work queue.
- **Lifecycle:** Follow the `FRAME -> SHAPE -> BUILD -> PROVE` workflow.
- **Governance:** Promotions are managed via `conductor wip promote`.
- **Intelligence:** Conductor MCP tools are available for routing and mission synthesis.
