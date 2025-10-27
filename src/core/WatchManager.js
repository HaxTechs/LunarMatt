const fs = require('fs');
const { WATCH_INTERVAL } = require('../config/constants');
const Logger = require('../utils/Logger');

/**
 * Watch mode manager
 * Monitors wallpaper changes and triggers theme updates
 */
class WatchManager {
  constructor(wallpaperDetector, onWallpaperChange) {
    this.wallpaperDetector = wallpaperDetector;
    this.onWallpaperChange = onWallpaperChange;
    this.lastWallpaper = null;
    this.lastModified = null;
    this.intervalId = null;
  }

  /**
   * Start watching for wallpaper changes
   */
  async start() {
    Logger.watching('Watch mode activated!');
    Logger.info(`Monitoring wallpaper changes every ${WATCH_INTERVAL / 1000} seconds...`);
    Logger.info('Press Ctrl+C to stop');
    Logger.separator();

    // Initial check
    await this.check();

    // Set up interval
    this.intervalId = setInterval(() => this.check(), WATCH_INTERVAL);

    // Handle graceful shutdown
    process.on('SIGINT', () => this.stop());
  }

  /**
   * Check for wallpaper changes
   */
  async check() {
    try {
      const currentWallpaper = await this.wallpaperDetector();

      // Check if wallpaper path changed
      if (currentWallpaper !== this.lastWallpaper) {
        await this.handleWallpaperChange(currentWallpaper);
        return;
      }

      // Check if file was modified (for symlinks pointing to same path)
      await this.checkFileModification(currentWallpaper);
    } catch (error) {
      Logger.warning(`Error checking wallpaper: ${error.message}`);
    }
  }

  /**
   * Handle wallpaper path change
   */
  async handleWallpaperChange(newWallpaper) {
    Logger.separator();
    Logger.detected('Wallpaper changed!');
    Logger.info(`Old: ${this.lastWallpaper || 'none'}`);
    Logger.info(`New: ${newWallpaper}`);
    Logger.separator();

    this.lastWallpaper = newWallpaper;

    // Trigger theme update
    await this.onWallpaperChange(newWallpaper);

    Logger.success(`Theme updated at ${new Date().toLocaleTimeString()}`);
    Logger.watching('Continuing to watch for changes...');
    Logger.separator();
  }

  /**
   * Check if wallpaper file was modified
   */
  async checkFileModification(wallpaperPath) {
    if (!wallpaperPath) return;

    try {
      const stats = fs.statSync(wallpaperPath);
      const currentModified = stats.mtimeMs;

      if (this.lastModified && currentModified !== this.lastModified) {
        Logger.separator();
        Logger.detected('Wallpaper file modified!');
        Logger.info(`Path: ${wallpaperPath}`);
        Logger.separator();

        // Trigger theme update
        await this.onWallpaperChange(wallpaperPath);

        Logger.success(`Theme updated at ${new Date().toLocaleTimeString()}`);
        Logger.watching('Continuing to watch for changes...');
        Logger.separator();
      }

      this.lastModified = currentModified;
    } catch (error) {
      // File might have been deleted/moved
    }
  }

  /**
   * Stop watching
   */
  stop() {
    Logger.separator();
    Logger.separator();
    Logger.info('Stopping watch mode...');
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    Logger.success('Goodbye!');
    process.exit(0);
  }
}

module.exports = WatchManager;