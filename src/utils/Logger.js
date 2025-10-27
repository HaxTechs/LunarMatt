/**
 * Consistent logging utility with colors and emojis
 */
class Logger {
  static info(message) {
    console.log(`ℹ️  ${message}`);
  }

  static success(message) {
    console.log(`✅ ${message}`);
  }

  static warning(message) {
    console.warn(`⚠️  ${message}`);
  }

  static error(message) {
    console.error(`❌ ${message}`);
  }

  static debug(message) {
    if (process.env.DEBUG) {
      console.log(`🐛 ${message}`);
    }
  }

  static searching(message) {
    console.log(`🔍 ${message}`);
  }

  static extracting(message) {
    console.log(`🎨 ${message}`);
  }

  static watching(message) {
    console.log(`👀 ${message}`);
  }

  static detected(message) {
    console.log(`🔔 ${message}`);
  }

  static separator() {
    console.log('');
  }

  static header(message) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`  ${message}`);
    console.log(`${'='.repeat(50)}\n`);
  }

  static colorPalette(palette) {
    console.log('\n✨ Extracted Color Palette:');
    Object.keys(palette).forEach(key => {
      if (palette[key]) {
        console.log(`   ${key.padEnd(15)}: ${palette[key].hex}`);
      }
    });
  }

  static tip(message) {
    console.log(`💡 ${message}`);
  }

  static rocket(message) {
    console.log(`🚀 ${message}`);
  }
}

module.exports = Logger;