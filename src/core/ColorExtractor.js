const { Vibrant } = require('node-vibrant/node');
const Logger = require('../utils/Logger');

/**
 * Color extraction from images using node-vibrant
 */
class ColorExtractor {
  /**
   * Extract color palette from an image
   * @param {string} imagePath - Path to the image file
   * @returns {Promise<Object>} Color palette with Vibrant, Muted, Dark, Light variations
   */
  async extract(imagePath) {
    Logger.extracting('Extracting colors from wallpaper...');
    Logger.info(`Source: ${imagePath}`);
    
    try {
      const vibrant = new Vibrant(imagePath);
      const palette = await vibrant.getPalette();
      
      Logger.colorPalette(palette);
      
      return palette;
    } catch (error) {
      throw new Error(`Failed to extract colors: ${error.message}`);
    }
  }

  /**
   * Get a fallback palette if extraction fails
   * @returns {Object} Default color palette
   */
  getFallbackPalette() {
    return {
      Vibrant: { hex: '#89b4fa' },
      LightVibrant: { hex: '#a6e3a1' },
      DarkVibrant: { hex: '#f38ba8' },
      Muted: { hex: '#6c7086' },
    };
  }
}

module.exports = ColorExtractor;