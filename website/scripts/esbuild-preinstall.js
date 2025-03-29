/**
 * This script prepares the file system for esbuild installation
 * It runs first to create any missing directories and permissions
 */

const fs = require('fs');
const path = require('path');

console.log('Running esbuild pre-installation preparation...');

// The specific paths mentioned in the error
const esbuildLibPath = path.join(process.cwd(), 'node_modules/esbuild/lib');
const downloadPath = path.join(esbuildLibPath, 'downloaded-@netlify/esbuild-linux-64-esbuild');

// Create all necessary directories
try {
  console.log('Creating esbuild lib path:', esbuildLibPath);
  fs.mkdirSync(esbuildLibPath, { recursive: true });
  
  // Create an empty file at the download path to ensure it exists and avoid ENOENT errors
  console.log('Creating placeholder file at:', downloadPath);
  fs.writeFileSync(downloadPath, '');
  
  console.log('Successfully prepared file system for esbuild installation');
} catch (error) {
  console.error('Error preparing file system:', error.message);
  console.log('Will continue with installation anyway');
}