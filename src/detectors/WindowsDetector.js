const BaseDetector = require('./BaseDetector');
const { getWallpaper } = require('wallpaper');
const fs = require('fs');

/**
 * Windows wallpaper detector
 * Uses the wallpaper package which reads from Windows registry
 */
class WindowsDetector extends BaseDetector {
  isApplicable() {
    return process.platform === 'win32';
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
    return 'Windows';
  }
}

module.exports = WindowsDetector;