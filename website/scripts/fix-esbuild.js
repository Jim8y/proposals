/**
 * This script attempts to fix esbuild installation issues in Netlify builds
 * It creates directories and modifies the file system to ensure esbuild can install correctly
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running enhanced esbuild fix script...');

// Create required directories to prevent ENOENT errors
const dirs = [
  path.join(process.cwd(), 'node_modules'),
  path.join(process.cwd(), 'node_modules/esbuild'),
  path.join(process.cwd(), 'node_modules/esbuild/lib'),
  path.join(process.cwd(), 'node_modules/@netlify'),
];

// Create all the necessary directories
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Create the download target directory
const downloadDir = path.join(process.cwd(), 'node_modules/esbuild/lib');
if (!fs.existsSync(downloadDir)) {
  console.log(`Creating esbuild lib directory: ${downloadDir}`);
  fs.mkdirSync(downloadDir, { recursive: true });
}

// Attempt direct installation
try {
  console.log('Installing esbuild directly...');
  execSync('npm install esbuild --no-save', { stdio: 'inherit' });
} catch (err) {
  console.warn('Direct esbuild installation failed:', err.message);
}

// Try to manually download the esbuild binary
try {
  console.log('Manually downloading esbuild-linux-64...');
  
  // Create a temporary directory
  const tempDir = path.join(process.cwd(), 'temp-esbuild');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Download the package
  execSync('curl -L https://registry.npmjs.org/@netlify/esbuild-linux-64/-/esbuild-linux-64-0.14.39.tgz -o esbuild-linux-64.tgz', {
    cwd: tempDir,
    stdio: 'inherit'
  });
  
  // Extract it
  execSync('tar -xzf esbuild-linux-64.tgz', {
    cwd: tempDir,
    stdio: 'inherit'
  });
  
  // Create the target directory
  const targetDir = path.join(process.cwd(), 'node_modules/@netlify/esbuild-linux-64');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    fs.mkdirSync(path.join(targetDir, 'bin'), { recursive: true });
  }
  
  // Copy binary to the correct location
  execSync('cp -R package/* ../esbuild-linux-64/', {
    cwd: tempDir,
    stdio: 'inherit'
  });
  
  console.log('Successfully installed esbuild-linux-64 manually');
} catch (err) {
  console.warn('Manual esbuild-linux-64 installation failed:', err.message);
}

console.log('Enhanced esbuild fix script completed');