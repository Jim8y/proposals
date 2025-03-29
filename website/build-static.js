const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const sourceDir = path.join(__dirname, 'public');
const buildDir = path.join(__dirname, 'build');
const staticIndexHtmlPath = path.join(__dirname, 'static-index.html');

console.log('Starting static build process...');

// Create build directory if it doesn't exist
if (!fs.existsSync(buildDir)) {
  console.log('Creating build directory...');
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy all files from public directory to build directory
console.log('Copying public files to build directory...');
try {
  execSync(`cp -R ${sourceDir}/* ${buildDir}/`);
  console.log('Successfully copied public files to build directory');
} catch (error) {
  console.error('Error copying public files:', error);
  process.exit(1);
}

// Copy our static index.html to the build directory
console.log('Copying static index.html to build directory...');
try {
  fs.copyFileSync(staticIndexHtmlPath, path.join(buildDir, 'index.html'));
  console.log('Successfully copied static index.html to build directory');
} catch (error) {
  console.error('Error copying static index.html:', error);
  process.exit(1);
}

console.log('Static build completed successfully!');
