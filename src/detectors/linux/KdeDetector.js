const BaseDetector = require('../BaseDetector');
const fs = require('fs');

/**
 * KDE Plasma wallpaper detector
 * Uses wallpaper package which reads KDE config files
 */
class KdeDetector extends BaseDetector {
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

  async isApplicable() {
    const desktopSession = process.env.DESKTOP_SESSION || '';
    const xdgCurrentDesktop = process.env.XDG_CURRENT_DESKTOP || '';

    return (
      desktopSession.includes('plasma') ||
      desktopSession.includes('kde') ||
      xdgCurrentDesktop.includes('KDE')
    );
  }

  async detect() {
    try {
      const getWallpaper = await this.loadWallpaperModule();
      const wallpaperPath = await getWallpaper();

      if (fs.existsSync(wallpaperPath)) {
        return wallpaperPath;
      }
    } catch (error) {
      // KDE config not available or failed
    }

    return null;
  }

  getName() {
    return 'KDE';
  }
}

module.exports = KdeDetector;