# Project Memory

Use this file to store stable context that future work should not have to rediscover.

## Project Summary

Palette Generator is a static Vercel-hosted Canvas showcase that extracts dominant colors from user-provided images, displays hex swatches, supports clipboard copy, and exports the palette as a PNG strip.

## Current Priorities

- Ship a reliable single-page upload -> quantize -> palette render flow.
- Keep theme consistency with Northline shared assets and accessible interaction states.

## Key Constraints

- Browser-only implementation (no server, no external image APIs).
- No build step or framework; must run directly from `index.html`.
- Quantization should remain fast by sampling from a scaled canvas (max 200x200).

## Important Decisions

- Decision: Use median-cut quantization in `js/quantize.js` with pure helper functions.
- Decision: Cache sampled pixels after upload and regenerate palette on size changes without rereading files.
- Decision: Use Northline shared theme files from `bg-remover` as the baseline.
- Decision: Keep deployment fully static on Vercel with repo-root publishing.
  Reason: Preserves the no-build workflow while allowing branded URLs and Git-linked deploys.

## Conventions

- Folder structure: static assets split into `css/`, `js/`, `shared/`, `assets/`, and `tasks/`.
- Theme persistence key: `northline-theme`.
- Palette size options are fixed to `6`, `8`, `10`, `12` in UI.
- Accessibility baseline: keyboard-reachable drop zone, labeled action buttons, visible focus states.

## Useful Commands

```text
# Open app locally in browser (PowerShell example)
Start-Process "D:\Projects\github-projects\palette-generator\index.html"

# Quick list of project files
Get-ChildItem -Recurse "D:\Projects\github-projects\palette-generator"
```

## Open Questions

- Add optional nearest-brand-color matching mode in a future iteration?
- Add copy-all palette action and JSON export format?
