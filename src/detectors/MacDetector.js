const BaseDetector = require('./BaseDetector');
const fs = require('fs');

/**
 * macOS wallpaper detector
 * Uses the wallpaper package which reads from macOS preferences
 */
class MacDetector extends BaseDetector {
  constructor() {
    super();
    this.getWallpaper = null;
  }

  async loadWallpaperModule() {
    if (!this.getWallpaper) {
      const wallpaper = await import('wallpaper');
      this.getWallpaper = wallpaper.getWallpaper;
    }
    return this.getWallpaper;
  }

  isApplicable() {
    return process.platform === 'darwin';
  }

  async detect() {
    try {
      const getWallpaper = await this.loadWallpaperModule();
      const wallpaperPath = await getWallpaper();

      if (fs.existsSync(wallpaperPath)) {
        return wallpaperPath;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  getName() {
    return 'macOS';
  }
}

module.exports = MacDetector;