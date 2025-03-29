/**
 * This script attempts to fix esbuild installation issues in Netlify builds
 * It modifies the npm installation process to properly handle optionalDependencies
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running esbuild fix script...');

// Try to install esbuild directly first
try {
  console.log('Attempting to install esbuild platform-specific binary...');
  execSync('npm install esbuild', { stdio: 'inherit' });
  console.log('Successfully installed esbuild');
} catch (error) {
  console.warn('Could not install esbuild directly:', error.message);
  
  // If direct installation fails, try to fix the Netlify esbuild
  try {
    console.log('Attempting to install required esbuild-linux-64 package directly...');
    execSync('npm install @netlify/esbuild-linux-64@0.14.39 --no-save', { stdio: 'inherit' });
    console.log('Successfully installed esbuild-linux-64');
  } catch (err) {
    console.error('Failed to install @netlify/esbuild-linux-64 directly:', err.message);
    console.log('Will attempt to continue anyway...');
  }
}

console.log('esbuild fix script completed');