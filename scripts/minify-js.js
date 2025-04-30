const { minify } = require('terser');
const fs = require('fs');
const path = require('path');

// Create directory if it doesn't exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Minify JS files
async function minifyJS() {
  console.log('Minifying JavaScript...');
  
  const jsDir = path.join(__dirname, '../assets/js');
  const outputDir = path.join(__dirname, '../dist/assets/js');
  const vendorDir = path.join(jsDir, 'vendor');
  const vendorOutputDir = path.join(outputDir, 'vendor');
  
  // Ensure output directories exist
  ensureDirectoryExists(outputDir);
  ensureDirectoryExists(vendorOutputDir);
  
  try {
    // Process main JS file
    const jsFile = path.join(jsDir, 'functions.js');
    if (fs.existsSync(jsFile)) {
      const js = fs.readFileSync(jsFile, 'utf8');
      
      // Minify JS
      const minified = await minify(js, {
        compress: {
          drop_console: true
        },
        mangle: true
      });
      
      // Write minified JS
      fs.writeFileSync(path.join(outputDir, 'functions.min.js'), minified.code);
      
      // Copy original for reference
      fs.copyFileSync(jsFile, path.join(outputDir, 'functions.js'));
    }
    
    // Copy vendor files
    if (fs.existsSync(vendorDir)) {
      const vendorFiles = fs.readdirSync(vendorDir);
      vendorFiles.forEach(file => {
        fs.copyFileSync(
          path.join(vendorDir, file),
          path.join(vendorOutputDir, file)
        );
      });
    }
    
    console.log('JavaScript minification completed successfully!');
  } catch (error) {
    console.error('Error minifying JavaScript:', error);
    process.exit(1);
  }
}

minifyJS();
