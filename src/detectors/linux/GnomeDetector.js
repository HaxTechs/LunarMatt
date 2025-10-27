const BaseDetector = require('../BaseDetector');
const { getWallpaper } = require('wallpaper');
const fs = require('fs');

/**
 * GNOME/Unity wallpaper detector
 * Uses gsettings to read wallpaper from dconf
 */
class GnomeDetector extends BaseDetector {
  async isApplicable() {
    // Check if GNOME or Unity is running
    const desktopSession = process.env.DESKTOP_SESSION || '';
    const xdgCurrentDesktop = process.env.XDG_CURRENT_DESKTOP || '';
    
    return (
      desktopSession.includes('gnome') ||
      desktopSession.includes('ubuntu') ||
      xdgCurrentDesktop.includes('GNOME') ||
      xdgCurrentDesktop.includes('Unity')
    );
  }

  async detect() {
    try {
      const wallpaperPath = await getWallpaper();
      
      if (fs.existsSync(wallpaperPath)) {
        return wallpaperPath;
      }
    } catch (error) {
      // gsettings not available or failed
    }
    
    return null;
  }

  getName() {
    return 'GNOME';
  }
}

module.exports = GnomeDetector;