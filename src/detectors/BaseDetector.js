/**
 * Base class for wallpaper detectors
 * All platform-specific detectors should extend this class
 */
class BaseDetector {
  /**
   * Detect the current wallpaper path
   * @returns {Promise<string|null>} Wallpaper path or null if not found
   */
  async detect() {
    throw new Error('detect() must be implemented by subclass');
  }

  /**
   * Check if this detector is applicable for the current system
   * @returns {boolean} True if detector can be used
   */
  isApplicable() {
    return true;
  }

  /**
   * Get the name of this detector for logging
   * @returns {string} Detector name
   */
  getName() {
    return this.constructor.name;
  }
}

module.exports = BaseDetector;