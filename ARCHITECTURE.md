# Architecture

Use this file to capture the project shape at a level that helps future contributors orient quickly.

## System Overview

Palette Generator is a single-page static web app. Users upload an image, the app samples pixels from a scaled offscreen canvas, runs median-cut quantization, and renders dominant colors as interactive swatches with copy and download actions.

## Major Components

- `index.html`: page structure, controls, preview/palette containers, and module entrypoint.
- `js/app.js`: event wiring, file loading, canvas drawing, palette rendering, clipboard copy, PNG export.
- `js/quantize.js`: pure quantization utilities (`extractPixels`, `quantizeMedianCut`, `rgbToHex`).
- `shared/tokens.css` + `shared/darkmode.css` + `shared/darkmode.js`: shared Northline design tokens and theme behavior.
- `css/style.css`: layout and component styling via semantic theme variables.

## Data Flow

1. User drops/selects an image file.
2. `FileReader` converts file to data URL and loads an `Image`.
3. Image draws onto hidden canvas scaled to max 200x200.
4. `getImageData()` is sampled, transparent pixels are filtered out.
5. Median-cut returns target dominant colors based on selected palette size.
6. UI renders swatches with hex labels and copy buttons.
7. Download action draws swatches + labels on export canvas and saves PNG.

## External Dependencies

- Browser Canvas API for image sampling and PNG export.
- Browser Clipboard API for copy action.
- Google Fonts for Fraunces, Manrope, and IBM Plex Mono.

## Boundaries And Interfaces

- Public UI contracts:
  - Palette size control with `6|8|10|12` options.
  - Drop zone accepts drag/drop, click, and Enter/Space activation.
  - Per-swatch copy action and global download action.
- Internal module boundary:
  - `quantize.js` remains DOM-independent and reusable.
  - `app.js` owns DOM state and side effects.

## Risks And Tradeoffs

- Median-cut is readable and fast at this scale but may not always match human-perceived "best" palettes.
- Clipboard writes can fail in restrictive browser contexts; UI handles failure state.
- Fonts from Google are external and may not load offline; app behavior still functions without custom fonts.

## Change Notes

- 2026-03-22: Initial scaffold created with Northline theming, median-cut quantization, swatch copy, and PNG export.