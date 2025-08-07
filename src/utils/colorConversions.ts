// Color conversion utilities for Color Magic app

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface HSVColor {
  h: number;
  s: number;
  v: number;
}

export interface CMYKColor {
  c: number;
  m: number;
  y: number;
  k: number;
}

export interface LABColor {
  l: number;
  a: number;
  b: number;
}

export interface YUVColor {
  y: number;
  u: number;
  v: number;
}

export type ColorModel = 'RGB' | 'HSV' | 'CMYK' | 'LAB' | 'YUV';

// RGB to HSV conversion
export function rgbToHsv(rgb: RGBColor): HSVColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  const s = max === 0 ? 0 : delta / max;
  const v = max;

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  };
}

// RGB to CMYK conversion
export function rgbToCmyk(rgb: RGBColor): CMYKColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const k = 1 - Math.max(r, g, b);
  const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
  const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
  const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
}

// RGB to LAB conversion (simplified approximation)
export function rgbToLab(rgb: RGBColor): LABColor {
  // Convert RGB to XYZ first
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  // Apply gamma correction
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // Convert to XYZ
  let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
  let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  // Convert XYZ to LAB
  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x + 16/116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y + 16/116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z + 16/116);

  const l = (116 * y) - 16;
  const a = 500 * (x - y);
  const bLab = 200 * (y - z);

  return {
    l: Math.round(l),
    a: Math.round(a),
    b: Math.round(bLab)
  };
}

// RGB to YUV conversion
export function rgbToYuv(rgb: RGBColor): YUVColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const u = -0.14713 * r - 0.28886 * g + 0.436 * b;
  const v = 0.615 * r - 0.51499 * g - 0.10001 * b;

  return {
    y: Math.round(y * 255),
    u: Math.round((u + 0.5) * 255),
    v: Math.round((v + 0.5) * 255)
  };
}

// Get color values in selected model
export function getColorInModel(rgb: RGBColor, model: ColorModel): string {
  switch (model) {
    case 'RGB':
      return `RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    case 'HSV':
      const hsv = rgbToHsv(rgb);
      return `HSV(${hsv.h}°, ${hsv.s}%, ${hsv.v}%)`;
    case 'CMYK':
      const cmyk = rgbToCmyk(rgb);
      return `CMYK(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
    case 'LAB':
      const lab = rgbToLab(rgb);
      return `LAB(${lab.l}, ${lab.a}, ${lab.b})`;
    case 'YUV':
      const yuv = rgbToYuv(rgb);
      return `YUV(${yuv.y}, ${yuv.u}, ${yuv.v})`;
    default:
      return `RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }
}

// Apply color model transformation to image data
export function transformImageData(imageData: ImageData, model: ColorModel): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  
  for (let i = 0; i < data.length; i += 4) {
    const rgb = { r: data[i], g: data[i + 1], b: data[i + 2] };
    
    switch (model) {
      case 'HSV':
        const hsv = rgbToHsv(rgb);
        // Enhance saturation and value for visual effect
        data[i] = Math.min(255, rgb.r * (1 + hsv.s / 200));
        data[i + 1] = Math.min(255, rgb.g * (1 + hsv.s / 200));
        data[i + 2] = Math.min(255, rgb.b * (1 + hsv.v / 200));
        break;
      case 'CMYK':
        const cmyk = rgbToCmyk(rgb);
        // Simulate CMYK color space
        data[i] = Math.max(0, 255 - (cmyk.c * 2.55 + cmyk.k * 2.55));
        data[i + 1] = Math.max(0, 255 - (cmyk.m * 2.55 + cmyk.k * 2.55));
        data[i + 2] = Math.max(0, 255 - (cmyk.y * 2.55 + cmyk.k * 2.55));
        break;
      case 'LAB':
        const lab = rgbToLab(rgb);
        // Enhance lab color space visualization
        data[i] = Math.max(0, Math.min(255, lab.l * 2.55));
        data[i + 1] = Math.max(0, Math.min(255, (lab.a + 128)));
        data[i + 2] = Math.max(0, Math.min(255, (lab.b + 128)));
        break;
      case 'YUV':
        const yuv = rgbToYuv(rgb);
        // Apply YUV transformation
        data[i] = yuv.y;
        data[i + 1] = yuv.u;
        data[i + 2] = yuv.v;
        break;
      default:
        // RGB - no transformation
        break;
    }
  }
  
  return new ImageData(data, imageData.width, imageData.height);
}