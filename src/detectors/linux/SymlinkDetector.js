const BaseDetector = require('../BaseDetector');
const { SYMLINK_PATHS } = require('../../config/constants');
const fs = require('fs');
const path = require('path');

/**
 * Symlink-based wallpaper detector
 * Checks predefined symlink paths that point to the active wallpaper
 */
class SymlinkDetector extends BaseDetector {
  async detect() {
    for (const symlinkPath of SYMLINK_PATHS) {
      if (fs.existsSync(symlinkPath)) {
        try {
          const stats = fs.lstatSync(symlinkPath);
          
          if (stats.isSymbolicLink()) {
            // It's a symlink - resolve it
            const target = fs.readlinkSync(symlinkPath);
            const resolved = path.resolve(path.dirname(symlinkPath), target);
            
            if (fs.existsSync(resolved)) {
              return resolved;
            }
          } else if (stats.isFile()) {
            // It's a regular file containing the path
            const content = fs.readFileSync(symlinkPath, 'utf8').trim();
            
            if (fs.existsSync(content)) {
              return content;
            }
          }
        } catch (error) {
          continue;
        }
      }
    }
    
    return null;
  }

  getName() {
    return 'Symlink';
  }
}

module.exports = SymlinkDetector;