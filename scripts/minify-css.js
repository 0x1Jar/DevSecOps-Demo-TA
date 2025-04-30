const CleanCSS = require('clean-css');
const fs = require('fs');
const path = require('path');

// Create directory if it doesn't exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Minify CSS files
async function minifyCSS() {
  console.log('Minifying CSS...');
  
  const cssDir = path.join(__dirname, '../assets/css');
  const outputDir = path.join(__dirname, '../dist/assets/css');
  
  // Ensure output directory exists
  ensureDirectoryExists(outputDir);
  
  try {
    // Read main.css
    const cssFile = path.join(cssDir, 'main.css');
    const css = fs.readFileSync(cssFile, 'utf8');
    
    // Minify CSS
    const minified = new CleanCSS({
      level: 2,
      compatibility: 'ie8'
    }).minify(css);
    
    // Write minified CSS
    fs.writeFileSync(path.join(outputDir, 'main.min.css'), minified.styles);
    
    // Copy original for reference
    fs.copyFileSync(cssFile, path.join(outputDir, 'main.css'));
    
    // Copy font files
    const fontDir = path.join(cssDir, 'fonts');
    const fontOutputDir = path.join(outputDir, 'fonts');
    ensureDirectoryExists(fontOutputDir);
    
    if (fs.existsSync(fontDir)) {
      const fontFiles = fs.readdirSync(fontDir);
      fontFiles.forEach(file => {
        fs.copyFileSync(
          path.join(fontDir, file),
          path.join(fontOutputDir, file)
        );
      });
    }
    
    console.log('CSS minification completed successfully!');
  } catch (error) {
    console.error('Error minifying CSS:', error);
    process.exit(1);
  }
}

minifyCSS();
