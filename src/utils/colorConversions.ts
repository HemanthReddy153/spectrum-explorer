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

// Apply color model transformation to image data with adjustments
export function transformImageData(imageData: ImageData, model: ColorModel, adjustments?: any): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  
  for (let i = 0; i < data.length; i += 4) {
    let rgb = { r: data[i], g: data[i + 1], b: data[i + 2] };
    
    // Apply manual adjustments first
    if (adjustments) {
      switch (model) {
        case 'RGB':
          if (adjustments.rgb) {
            rgb.r = Math.max(0, Math.min(255, rgb.r + (adjustments.rgb.r || 0)));
            rgb.g = Math.max(0, Math.min(255, rgb.g + (adjustments.rgb.g || 0)));
            rgb.b = Math.max(0, Math.min(255, rgb.b + (adjustments.rgb.b || 0)));
          }
          break;
        case 'HSV':
          if (adjustments.hsv) {
            const hsv = rgbToHsv(rgb);
            hsv.h = (hsv.h + (adjustments.hsv.h || 0) + 360) % 360;
            hsv.s = Math.max(0, Math.min(100, hsv.s + (adjustments.hsv.s || 0)));
            hsv.v = Math.max(0, Math.min(100, hsv.v + (adjustments.hsv.v || 0)));
            rgb = hsvToRgb(hsv);
          }
          break;
        case 'CMYK':
          if (adjustments.cmyk) {
            const cmyk = rgbToCmyk(rgb);
            cmyk.c = Math.max(0, Math.min(100, cmyk.c + (adjustments.cmyk.c || 0)));
            cmyk.m = Math.max(0, Math.min(100, cmyk.m + (adjustments.cmyk.m || 0)));
            cmyk.y = Math.max(0, Math.min(100, cmyk.y + (adjustments.cmyk.y || 0)));
            cmyk.k = Math.max(0, Math.min(100, cmyk.k + (adjustments.cmyk.k || 0)));
            rgb = cmykToRgb(cmyk);
          }
          break;
        case 'LAB':
          if (adjustments.lab) {
            const lab = rgbToLab(rgb);
            lab.l = Math.max(0, Math.min(100, lab.l + (adjustments.lab.l || 0)));
            lab.a = Math.max(-128, Math.min(127, lab.a + (adjustments.lab.a || 0)));
            lab.b = Math.max(-128, Math.min(127, lab.b + (adjustments.lab.b || 0)));
            rgb = labToRgb(lab);
          }
          break;
        case 'YUV':
          if (adjustments.yuv) {
            const yuv = rgbToYuv(rgb);
            yuv.y = Math.max(0, Math.min(255, yuv.y + (adjustments.yuv.y || 0)));
            yuv.u = Math.max(0, Math.min(255, yuv.u + (adjustments.yuv.u || 0)));
            yuv.v = Math.max(0, Math.min(255, yuv.v + (adjustments.yuv.v || 0)));
            rgb = yuvToRgb(yuv);
          }
          break;
      }
    }
    
    // Apply color model transformation for visualization
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
        // RGB - apply adjusted values
        data[i] = rgb.r;
        data[i + 1] = rgb.g;
        data[i + 2] = rgb.b;
        break;
    }
  }
  
  return new ImageData(data, imageData.width, imageData.height);
}

// Convert HSV back to RGB
export function hsvToRgb(hsv: HSVColor): RGBColor {
  const h = hsv.h / 60;
  const s = hsv.s / 100;
  const v = hsv.v / 100;

  const c = v * s;
  const x = c * (1 - Math.abs((h % 2) - 1));
  const m = v - c;

  let r = 0, g = 0, b = 0;

  if (h < 1) {
    r = c; g = x; b = 0;
  } else if (h < 2) {
    r = x; g = c; b = 0;
  } else if (h < 3) {
    r = 0; g = c; b = x;
  } else if (h < 4) {
    r = 0; g = x; b = c;
  } else if (h < 5) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

// Convert CMYK back to RGB
export function cmykToRgb(cmyk: CMYKColor): RGBColor {
  const c = cmyk.c / 100;
  const m = cmyk.m / 100;
  const y = cmyk.y / 100;
  const k = cmyk.k / 100;

  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);

  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b)
  };
}

// Convert LAB back to RGB (simplified)
export function labToRgb(lab: LABColor): RGBColor {
  // Convert LAB to XYZ
  let y = (lab.l + 16) / 116;
  let x = lab.a / 500 + y;
  let z = y - lab.b / 200;

  // Apply inverse transformation
  const x3 = x * x * x;
  const y3 = y * y * y;
  const z3 = z * z * z;

  x = x3 > 0.008856 ? x3 : (x - 16/116) / 7.787;
  y = y3 > 0.008856 ? y3 : (y - 16/116) / 7.787;
  z = z3 > 0.008856 ? z3 : (z - 16/116) / 7.787;

  // Reference white D65
  x *= 0.95047;
  y *= 1.00000;
  z *= 1.08883;

  // Convert XYZ to RGB
  let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let b = x * 0.0557 + y * -0.2040 + z * 1.0570;

  // Apply gamma correction
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1/2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1/2.4) - 0.055 : 12.92 * g;
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1/2.4) - 0.055 : 12.92 * b;

  return {
    r: Math.max(0, Math.min(255, Math.round(r * 255))),
    g: Math.max(0, Math.min(255, Math.round(g * 255))),
    b: Math.max(0, Math.min(255, Math.round(b * 255)))
  };
}

// Convert YUV back to RGB
export function yuvToRgb(yuv: YUVColor): RGBColor {
  const y = yuv.y / 255;
  const u = (yuv.u / 255) - 0.5;
  const v = (yuv.v / 255) - 0.5;

  const r = y + 1.403 * v;
  const g = y - 0.344 * u - 0.714 * v;
  const b = y + 1.770 * u;

  return {
    r: Math.max(0, Math.min(255, Math.round(r * 255))),
    g: Math.max(0, Math.min(255, Math.round(g * 255))),
    b: Math.max(0, Math.min(255, Math.round(b * 255)))
  };
}