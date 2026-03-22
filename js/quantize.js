(function attachQuantizeApi() {
  function componentRange(pixels, componentIndex) {
    let min = 255;
    let max = 0;

    for (let i = 0; i < pixels.length; i += 1) {
      const value = pixels[i][componentIndex];
      if (value < min) min = value;
      if (value > max) max = value;
    }

    return max - min;
  }

  function averageBucket(bucket) {
    if (!bucket.length) {
      return [0, 0, 0];
    }

    let r = 0;
    let g = 0;
    let b = 0;

    for (let i = 0; i < bucket.length; i += 1) {
      r += bucket[i][0];
      g += bucket[i][1];
      b += bucket[i][2];
    }

    return [
      Math.round(r / bucket.length),
      Math.round(g / bucket.length),
      Math.round(b / bucket.length),
    ];
  }

  function sortByDominantRange(pixels) {
    const ranges = [
      componentRange(pixels, 0),
      componentRange(pixels, 1),
      componentRange(pixels, 2),
    ];

    const channel = ranges.indexOf(Math.max(...ranges));
    return [...pixels].sort((a, b) => a[channel] - b[channel]);
  }

  function extractPixels(imageData, alphaThreshold) {
    const pixels = [];
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      if (alpha < alphaThreshold) {
        continue;
      }

      pixels.push([data[i], data[i + 1], data[i + 2]]);
    }

    return pixels;
  }

  // Median-cut quantization: repeatedly split the bucket with the widest color range.
  function quantizeMedianCut(inputPixels, targetCount) {
    if (!Array.isArray(inputPixels) || !inputPixels.length || targetCount < 1) {
      return [];
    }

    const initial = [...inputPixels];
    let buckets = [initial];

    while (buckets.length < targetCount) {
      buckets.sort((a, b) => {
        const aRange = Math.max(
          componentRange(a, 0),
          componentRange(a, 1),
          componentRange(a, 2)
        );
        const bRange = Math.max(
          componentRange(b, 0),
          componentRange(b, 1),
          componentRange(b, 2)
        );
        return bRange - aRange;
      });

      const bucket = buckets.shift();
      if (!bucket || bucket.length <= 1) {
        if (bucket) {
          buckets.push(bucket);
        }
        break;
      }

      const sorted = sortByDominantRange(bucket);
      const midpoint = Math.floor(sorted.length / 2);
      const left = sorted.slice(0, midpoint);
      const right = sorted.slice(midpoint);

      if (left.length) buckets.push(left);
      if (right.length) buckets.push(right);

      if (!left.length || !right.length) {
        break;
      }
    }

    return buckets.slice(0, targetCount).map((bucket) => averageBucket(bucket));
  }

  function rgbToHex(rgb) {
    return `#${rgb
      .map((value) => value.toString(16).padStart(2, '0'))
      .join('')}`;
  }

  window.PaletteQuantize = {
    extractPixels,
    quantizeMedianCut,
    rgbToHex,
  };
})();