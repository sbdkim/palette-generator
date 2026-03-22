(function bootstrapApp() {
  const quantizeApi = window.PaletteQuantize;
  const themeApi = window.NorthlineTheme;

  if (!quantizeApi || !themeApi) {
    return;
  }

  const { extractPixels, quantizeMedianCut, rgbToHex } = quantizeApi;
  const { initTheme } = themeApi;

  const MAX_SAMPLE_EDGE = 200;
  const DEFAULT_PALETTE_SIZE = 8;
  const COPY_LABEL_MS = 1500;

  const dropZone = document.getElementById('dropZone');
  const imageInput = document.getElementById('imageInput');
  const previewSection = document.getElementById('previewSection');
  const previewImage = document.getElementById('previewImage');
  const paletteSection = document.getElementById('paletteSection');
  const paletteSwatches = document.getElementById('paletteSwatches');
  const paletteSizeSelect = document.getElementById('paletteSize');
  const downloadButton = document.getElementById('downloadPalette');
  const workingCanvas = document.getElementById('workingCanvas');

  if (
    !dropZone ||
    !imageInput ||
    !previewSection ||
    !previewImage ||
    !paletteSection ||
    !paletteSwatches ||
    !paletteSizeSelect ||
    !downloadButton ||
    !workingCanvas
  ) {
    return;
  }

  const workingContext = workingCanvas.getContext('2d', { willReadFrequently: true });
  if (!workingContext) {
    return;
  }

  let cachedPixels = [];
  let currentPaletteHex = [];

  function resetDragState() {
    dropZone.classList.remove('is-dragover');
  }

  function setDragState() {
    dropZone.classList.add('is-dragover');
  }

  function getPaletteSize() {
    const value = Number.parseInt(paletteSizeSelect.value, 10);
    return Number.isNaN(value) ? DEFAULT_PALETTE_SIZE : value;
  }

  function clampDimensions(width, height, maxEdge) {
    const scale = Math.min(maxEdge / width, maxEdge / height, 1);
    return {
      width: Math.max(1, Math.round(width * scale)),
      height: Math.max(1, Math.round(height * scale)),
    };
  }

  function drawImageToWorkingCanvas(image) {
    const naturalWidth = image.naturalWidth || image.width;
    const naturalHeight = image.naturalHeight || image.height;
    const size = clampDimensions(naturalWidth, naturalHeight, MAX_SAMPLE_EDGE);

    workingCanvas.width = size.width;
    workingCanvas.height = size.height;

    workingContext.clearRect(0, 0, size.width, size.height);
    workingContext.drawImage(image, 0, 0, size.width, size.height);
  }

  function renderPalette(colorsHex) {
    paletteSwatches.innerHTML = '';

    const fragment = document.createDocumentFragment();

    colorsHex.forEach((hex) => {
      const swatch = document.createElement('article');
      swatch.className = 'swatch';

      const block = document.createElement('div');
      block.className = 'swatch-color';
      block.style.backgroundColor = hex;

      const meta = document.createElement('div');
      meta.className = 'swatch-meta';

      const hexLabel = document.createElement('div');
      hexLabel.className = 'swatch-hex';
      hexLabel.textContent = hex;

      const copyButton = document.createElement('button');
      copyButton.type = 'button';
      copyButton.className = 'copy-button';
      copyButton.textContent = 'Copy';
      copyButton.setAttribute('aria-label', `Copy hex code ${hex}`);

      copyButton.addEventListener('click', async () => {
        const original = copyButton.textContent;
        try {
          await navigator.clipboard.writeText(hex);
          copyButton.textContent = 'Copied!';
        } catch {
          copyButton.textContent = 'Failed';
        }

        window.setTimeout(() => {
          copyButton.textContent = original || 'Copy';
        }, COPY_LABEL_MS);
      });

      meta.append(hexLabel, copyButton);
      swatch.append(block, meta);
      fragment.appendChild(swatch);
    });

    paletteSwatches.appendChild(fragment);
  }

  function regeneratePalette() {
    if (!cachedPixels.length) {
      return;
    }

    const paletteSize = getPaletteSize();
    const quantized = quantizeMedianCut(cachedPixels, paletteSize);
    currentPaletteHex = quantized.map((rgb) => rgbToHex(rgb));

    renderPalette(currentPaletteHex);
    paletteSection.hidden = false;
  }

  function processLoadedImage(image, fileName) {
    drawImageToWorkingCanvas(image);

    const sampled = workingContext.getImageData(
      0,
      0,
      workingCanvas.width,
      workingCanvas.height
    );

    cachedPixels = extractPixels(sampled, 128);
    previewImage.src = image.src;
    previewImage.alt = fileName ? `${fileName} preview` : 'Uploaded image preview';
    previewSection.hidden = false;
    regeneratePalette();
  }

  function loadFile(file) {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => processLoadedImage(image, file.name);
      image.src = String(reader.result);
    };

    reader.readAsDataURL(file);
  }

  function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    resetDragState();

    const file = event.dataTransfer && event.dataTransfer.files
      ? event.dataTransfer.files[0]
      : null;
    loadFile(file);
  }

  function exportPalettePng() {
    if (!currentPaletteHex.length) {
      return;
    }

    const swatchWidth = 120;
    const canvasHeight = 160;
    const labelY = 138;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = swatchWidth * currentPaletteHex.length;
    exportCanvas.height = canvasHeight;

    const ctx = exportCanvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const rootStyles = window.getComputedStyle(document.documentElement);
    const labelColor = rootStyles.getPropertyValue('--color-text-primary').trim() || '#1f2933';
    const surfaceColor = rootStyles.getPropertyValue('--color-surface').trim() || '#fffdf8';

    ctx.fillStyle = surfaceColor;
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '500 14px "IBM Plex Mono", monospace';

    currentPaletteHex.forEach((hex, index) => {
      const x = index * swatchWidth;
      ctx.fillStyle = hex;
      ctx.fillRect(x, 0, swatchWidth, 120);

      ctx.fillStyle = labelColor;
      ctx.fillText(hex, x + swatchWidth / 2, labelY);
    });

    const anchor = document.createElement('a');
    anchor.href = exportCanvas.toDataURL('image/png');
    anchor.download = 'palette-strip.png';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  function setupEvents() {
    dropZone.addEventListener('click', () => {
      imageInput.click();
    });

    dropZone.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        imageInput.click();
      }
    });

    ['dragenter', 'dragover'].forEach((eventName) => {
      dropZone.addEventListener(eventName, (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragState();
      });
    });

    dropZone.addEventListener('dragleave', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const nextTarget = event.relatedTarget;
      if (!nextTarget || !dropZone.contains(nextTarget)) {
        resetDragState();
      }
    });

    dropZone.addEventListener('drop', handleDrop);

    imageInput.addEventListener('change', () => {
      const file = imageInput.files && imageInput.files.length
        ? imageInput.files[0]
        : null;
      loadFile(file);
      imageInput.value = '';
    });

    paletteSizeSelect.addEventListener('change', regeneratePalette);
    downloadButton.addEventListener('click', exportPalettePng);
  }

  initTheme();
  setupEvents();
})();