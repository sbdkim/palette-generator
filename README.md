# Palette Generator

Drop in an image, extract a color palette, and copy hex codes instantly in your browser.

## Live Demo
[https://shinbum-palette-generator.vercel.app/](https://shinbum-palette-generator.vercel.app/)

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
- Open `C:\Users\KRSBK\Documents\Projects\github-projects\palette-generator\index.html` directly in a browser (`file://...`).
- No install step or build step is required.

## Tests
No automated test suite is configured yet. Verification is manual in browser and recorded in `tasks/current-plan.md`.

## Deployment Notes
- Production deploys are served from Vercel at `https://shinbum-palette-generator.vercel.app/`.
- Pushes to `main` trigger automatic production deploys through the Vercel Git integration.
- Keep relative asset paths so the page works locally, during optional GitHub Pages testing, and on Vercel production.
- No environment variables are required.

## Theme / UI Notes
- Theme defaults to system preference (`prefers-color-scheme`) and supports manual override.
- Shared theme assets are in `shared/tokens.css`, `shared/darkmode.css`, and `shared/darkmode.js`.
- Manual theme choice is stored in `localStorage` under `northline-theme`.
- Page styles in `css/style.css` consume semantic variables and avoid hard-coded component colors.


## Branding / Theme Notes
- This project uses the Northline product-family shell language for its public-facing page.
- First visit defaults to light mode; dark mode is an explicit user choice and persists locally.
- Shared shell decisions should stay consistent with the current Northline header/topbar, title scale, spacing, and surface model.

## Project Layout
- `index.html` static app entrypoint
- `css/style.css` page and component styles
- `js/app.js` upload, sampling, rendering, copy, and export orchestration
- `js/quantize.js` median-cut and color helper utilities
- `shared/` theme tokens and dark-mode behavior
- `tasks/` active plan, backlog, and lessons

## Notes
All image processing runs locally in the browser. Files are not uploaded to any server.
