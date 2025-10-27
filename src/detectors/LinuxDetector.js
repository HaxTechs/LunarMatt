const BaseDetector = require('./BaseDetector');
const SymlinkDetector = require('./linux/SymlinkDetector');
const HyprlandDetector = require('./linux/HyprlandDetector');
const GnomeDetector = require('./linux/GnomeDetector');
const KdeDetector = require('./linux/KdeDetector');
const Logger = require('../utils/Logger');

/**
 * Linux wallpaper detector
 * Orchestrates all Linux-specific sub-detectors
 */
class LinuxDetector extends BaseDetector {
  constructor() {
    super();
    
    // Initialize sub-detectors in priority order
    this.detectors = [
      new SymlinkDetector(),      // Highest priority - explicit user choice
      new HyprlandDetector(),     // Wayland compositors
      new GnomeDetector(),        // GNOME/Unity
      new KdeDetector(),          // KDE Plasma
    ];
  }

  isApplicable() {
    return process.platform === 'linux';
  }

  async detect() {
    for (const detector of this.detectors) {
      try {
        // Check if detector is applicable
        const isApplicable = await detector.isApplicable();
        
        if (!isApplicable) {
          continue;
        }

        Logger.debug(`Trying ${detector.getName()} detector...`);
        
        // Try to detect wallpaper
        const result = await detector.detect();
        
        if (result) {
          Logger.debug(`${detector.getName()} detector found: ${result}`);
          return result;
        }
      } catch (error) {
        Logger.debug(`${detector.getName()} detector failed: ${error.message}`);
      }
    }
    
    return null;
  }

  getName() {
    return 'Linux';
  }
}

module.exports = LinuxDetector;