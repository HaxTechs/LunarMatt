/**
 * Color manipulation utilities
 */
class ColorUtils {
  /**
   * Convert hex color to RGB object
   */
  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /**
   * Convert RGB values to hex color
   */
  static rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Adjust brightness of a hex color by percentage
   * @param {string} hex - Hex color code
   * @param {number} percent - Percentage to adjust (-100 to 100)
   */
  static adjustBrightness(hex, percent) {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;

    const adjust = (value) => {
      const adjusted = Math.round(value * (1 + percent / 100));
      return Math.max(0, Math.min(255, adjusted));
    };

    return this.rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b));
  }

  /**
   * Adjust saturation of a hex color by percentage
   * @param {string} hex - Hex color code
   * @param {number} percent - Percentage to adjust (-100 to 100)
   */
  static adjustSaturation(hex, percent) {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;

    const { r, g, b } = rgb;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    if (delta === 0) return hex; // Gray color

    const saturation = delta / max;
    const newSaturation = Math.max(0, Math.min(1, saturation * (1 + percent / 100)));

    const adjust = (value) => {
      const gray = max - delta * saturation;
      return Math.round(gray + (value - gray) * (newSaturation / saturation));
    };

    return this.rgbToHex(adjust(r), adjust(g), adjust(b));
  }

  /**
   * Add opacity to hex color
   * @param {string} hex - Hex color code
   * @param {number} opacity - Opacity value (0-1)
   */
  static withOpacity(hex, opacity) {
    return `${hex}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  }

  /**
   * Blend two colors
   * @param {string} color1 - First hex color
   * @param {string} color2 - Second hex color
   * @param {number} ratio - Blend ratio (0-1), 0.5 is equal blend
   */
  static blend(color1, color2, ratio = 0.5) {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    if (!rgb1 || !rgb2) return color1;

    const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
    const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
    const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);

    return this.rgbToHex(r, g, b);
  }

  /**
   * Check if a color is dark
   * @param {string} hex - Hex color code
   * @returns {boolean} True if color is dark
   */
  static isDark(hex) {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return false;

    // Calculate relative luminance
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance < 0.5;
  }
}

module.exports = ColorUtils;