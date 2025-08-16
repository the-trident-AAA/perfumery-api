const fs = require('fs');
const path = require('path');

// Create dist/assets/images directory if it doesn't exist
const distAssetsPath = path.join(__dirname, 'dist', 'assets', 'images');
const srcAssetsPath = path.join(__dirname, 'src', 'assets', 'images');

// Create directory structure
if (!fs.existsSync(distAssetsPath)) {
  fs.mkdirSync(distAssetsPath, { recursive: true });
  console.log('Created directory:', distAssetsPath);
}

// Copy images from src to dist
if (fs.existsSync(srcAssetsPath)) {
  const files = fs.readdirSync(srcAssetsPath);
  
  if (files.length === 0) {
    console.log('No images found in src/assets/images/');
  } else {
    files.forEach(file => {
      const srcFile = path.join(srcAssetsPath, file);
      const distFile = path.join(distAssetsPath, file);
      
      if (fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, distFile);
        console.log(`Copied: ${file}`);
      }
    });
    console.log('Assets copied successfully!');
  }
} else {
  console.log('Source assets directory not found:', srcAssetsPath);
}
