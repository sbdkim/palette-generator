# Palette Generator

Drop in an image, extract a color palette, and copy hex codes instantly in your browser.

## Live Demo
Deployment target is GitHub Pages. If not yet published, open `index.html` locally for the full experience.

## Key Features
- Drag-and-drop image upload or click-to-browse file input (`image/*`)
- Canvas sampling with median-cut quantization for 6, 8, 10, or 12 dominant colors
- One-click hex copy per swatch with inline confirmation
- PNG strip export for the full generated palette
- Northline light/dark theme toggle with persisted preference (`northline-theme`)

## Tech Stack
- HTML, CSS, vanilla JavaScript modules
- Browser Canvas API (`drawImage`, `getImageData`, export canvas PNG)
- LocalStorage for manual theme persistence

## Setup / Run Locally
- Open `D:\Projects\github-projects\palette-generator\index.html` directly in a browser (`file://...`).
- No install step or build step is required.

## Tests
No automated test suite is configured yet. Verification is manual in browser and recorded in `tasks/current-plan.md`.

## Deployment Notes
- Designed for static hosting on GitHub Pages.
- Keep relative asset paths so the page works under repository subpaths.
- No environment variables are required.

## Theme / UI Notes
- Theme defaults to system preference (`prefers-color-scheme`) and supports manual override.
- Shared theme assets are in `shared/tokens.css`, `shared/darkmode.css`, and `shared/darkmode.js`.
- Manual theme choice is stored in `localStorage` under `northline-theme`.
- Page styles in `css/style.css` consume semantic variables and avoid hard-coded component colors.

## Project Layout
- `index.html` static app entrypoint
- `css/style.css` page and component styles
- `js/app.js` upload, sampling, rendering, copy, and export orchestration
- `js/quantize.js` median-cut and color helper utilities
- `shared/` theme tokens and dark-mode behavior
- `tasks/` active plan, backlog, and lessons

## Notes
All image processing runs locally in the browser. Files are not uploaded to any server.