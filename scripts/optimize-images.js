const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const fs = require('fs');
const path = require('path');

// Create directory if it doesn't exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Optimize PNG and JPG images to WebP
async function optimizeImages() {
  console.log('Optimizing images...');
  
  const imgDir = path.join(__dirname, '../assets/img');
  const outputDir = path.join(__dirname, '../dist/assets/img');
  
  // Ensure output directory exists
  ensureDirectoryExists(outputDir);
  
  try {
    // Optimize and convert to WebP
    const files = await imagemin([`${imgDir}/*.{jpg,png}`], {
      destination: outputDir,
      plugins: [
        imageminWebp({ quality: 75 })
      ]
    });
    
    // Also copy original files for browsers that don't support WebP
    await imagemin([`${imgDir}/*.{jpg,png,svg,gif}`], {
      destination: outputDir
    });
    
    console.log(`${files.length} images optimized successfully!`);
  } catch (error) {
    console.error('Error optimizing images:', error);
    process.exit(1);
  }
}

optimizeImages();
