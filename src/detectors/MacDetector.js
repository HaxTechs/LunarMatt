const BaseDetector = require('./BaseDetector');
const { getWallpaper } = require('wallpaper');
const fs = require('fs');

/**
 * macOS wallpaper detector
 * Uses the wallpaper package which reads from macOS preferences
 */
class MacDetector extends BaseDetector {
  isApplicable() {
    return process.platform === 'darwin';
  }

  async detect() {
    try {
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