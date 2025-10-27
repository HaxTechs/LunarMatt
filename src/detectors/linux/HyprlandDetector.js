const BaseDetector = require('../BaseDetector');
const { HYPRLAND_PATHS, QUICKSHELL_PATHS } = require('../../config/constants');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const os = require('os');

const execAsync = promisify(exec);

/**
 * Hyprland wallpaper detector
 * Supports: swww, hyprpaper, quickshell, swaybg
 */
class HyprlandDetector extends BaseDetector {
  async isApplicable() {
    // Check if running Hyprland
    try {
      await execAsync('pgrep -x Hyprland');
      return true;
    } catch {
      return false;
    }
  }

  async detectSwww() {
    try {
      const { stdout } = await execAsync('swww query 2>/dev/null');
      const match = stdout.match(/image:\s*(.+)/);
      
      if (match) {
        const wallpaperPath = match[1].trim();
        if (fs.existsSync(wallpaperPath)) {
          return wallpaperPath;
        }
      }
    } catch (error) {
      // swww not running
    }
    
    return null;
  }

  async detectHyprpaper() {
    try {
      // Try hyprctl first
      const { stdout } = await execAsync('hyprctl hyprpaper listloaded 2>/dev/null');
      const lines = stdout.trim().split('\n');
      
      if (lines.length > 0) {
        const lastImage = lines[lines.length - 1].trim();
        if (fs.existsSync(lastImage)) {
          return lastImage;
        }
      }
    } catch (error) {
      // Try config file
    }

    // Check hyprpaper config
    if (fs.existsSync(HYPRLAND_PATHS.hyprpaper)) {
      const config = fs.readFileSync(HYPRLAND_PATHS.hyprpaper, 'utf8');
      
      // Look for wallpaper = monitor,path format
      const wallpaperMatches = config.match(/wallpaper\s*=\s*[^,]+,(.+)/g);
      
      if (wallpaperMatches && wallpaperMatches.length > 0) {
        const lastMatch = wallpaperMatches[wallpaperMatches.length - 1];
        const pathMatch = lastMatch.match(/wallpaper\s*=\s*[^,]+,(.+)/);
        
        if (pathMatch) {
          const wallpaperPath = pathMatch[1].trim().replace(/["']/g, '');
          const expandedPath = this.expandPath(wallpaperPath);
          
          if (fs.existsSync(expandedPath)) {
            return expandedPath;
          }
        }
      }
    }
    
    return null;
  }

  async detectQuickShell() {
    for (const configPath of QUICKSHELL_PATHS) {
      if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, 'utf8').trim();
        
        if (fs.existsSync(content)) {
          return content;
        }
      }
    }
    
    return null;
  }

  async detectSwaybg() {
    try {
      const { stdout } = await execAsync('pgrep -a swaybg 2>/dev/null');
      const match = stdout.match(/swaybg.+?\s+(.+\.(jpg|jpeg|png|webp))/i);
      
      if (match) {
        const wallpaperPath = match[1].trim();
        if (fs.existsSync(wallpaperPath)) {
          return wallpaperPath;
        }
      }
    } catch (error) {
      // swaybg not running
    }
    
    return null;
  }

  async detectFromConfig() {
    if (!fs.existsSync(HYPRLAND_PATHS.config)) {
      return null;
    }

    const config = fs.readFileSync(HYPRLAND_PATHS.config, 'utf8');
    const patterns = [
      /exec-once\s*=\s*swww.+?img\s+(.+)/,
      /exec-once\s*=\s*swaybg.+?-i\s+(.+)/,
    ];

    for (const pattern of patterns) {
      const match = config.match(pattern);
      
      if (match && match[1]) {
        const wallpaperPath = match[1].trim().replace(/["']/g, '');
        const expandedPath = this.expandPath(wallpaperPath);
        
        if (fs.existsSync(expandedPath)) {
          return expandedPath;
        }
      }
    }
    
    return null;
  }

  expandPath(wallpaperPath) {
    if (wallpaperPath.startsWith('~')) {
      return path.join(os.homedir(), wallpaperPath.slice(2));
    }
    return wallpaperPath;
  }

  async detect() {
    // Try methods in order of reliability
    const methods = [
      () => this.detectSwww(),
      () => this.detectHyprpaper(),
      () => this.detectQuickShell(),
      () => this.detectSwaybg(),
      () => this.detectFromConfig(),
    ];

    for (const method of methods) {
      const result = await method();
      if (result) {
        return result;
      }
    }

    return null;
  }

  getName() {
    return 'Hyprland';
  }
}

module.exports = HyprlandDetector;