# Project Agent Guide

This repo is a static GitHub Pages app for extracting dominant image colors in-browser with Canvas APIs.

## Working Agreement

- Keep the app fully client-side: no uploads, no backend calls, no external image processing APIs.
- Keep core logic readable and split by concern:
  - `js/quantize.js` for pure color quantization utilities
  - `js/app.js` for DOM orchestration and user interactions
- Update `tasks/current-plan.md` for non-trivial changes and include verification evidence before marking done.
- Use `tasks/todo.md` for follow-up improvements and `tasks/lessons.md` only for reusable prevention rules.

## Frontend Defaults

- Follow Northline defaults for typography and shell styling.
- Keep shared theme behavior in `shared/tokens.css`, `shared/darkmode.css`, and `shared/darkmode.js`.
- Persist manual theme override under `northline-theme`.
- Use semantic CSS variables in page styles; avoid hard-coded component colors.
- Preserve keyboard accessibility and visible `:focus-visible` states.

## Suggested Flow For Non-Trivial Work

1. Refresh `tasks/current-plan.md` with goal, checklist, and verification plan.
2. Implement changes with small, readable modules.
3. Verify behavior manually in browser and record the checks.
4. Update `README.md`, `PROJECT_MEMORY.md`, or `ARCHITECTURE.md` if behavior or structure changed.

## Definition Of Done

- Requested behavior is implemented and browser-verified.
- Accessibility expectations are met (keyboard interactions, labels, focus states).
- Theme behavior works in light/dark with persistence.
- Documentation and task notes reflect the current project state.