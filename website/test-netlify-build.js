/**
 * This script tests the Netlify build process locally to verify our esbuild fixes
 * It simulates the environment and steps of the Netlify deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Helper functions
const log = (message) => console.log(`[TEST] ${message}`);
const error = (message) => console.error(`[ERROR] ${message}`);
const success = (message) => console.log(`[SUCCESS] ${message}`);

// Clean up function
const cleanup = () => {
  log('Cleaning up test environment...');
  try {
    if (fs.existsSync('node_modules')) {
      // Just rename instead of deleting to make it faster for testing
      if (fs.existsSync('node_modules.bak')) {
        execSync('rm -rf node_modules.bak');
      }
      execSync('mv node_modules node_modules.bak');
    }
    
    // Remove test files
    ['.npmrc', 'test-results.log'].forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
    
    if (fs.existsSync('/tmp/mock-esbuild')) {
      fs.unlinkSync('/tmp/mock-esbuild');
    }
    
    success('Cleanup completed');
  } catch (err) {
    error(`Cleanup failed: ${err.message}`);
  }
};

// Test execution function
const runTest = () => {
  log('Starting Netlify build simulation test');

  try {
    // Step 1: Clean up environment
    cleanup();
    
    // Step 2: Create empty node_modules directory
    log('Creating empty node_modules directory');
    fs.mkdirSync('node_modules', { recursive: true });
    
    // Step 3: Run the netlify-build.sh script
    log('Running netlify-build.sh script');
    const output = execSync('bash netlify-build.sh', { encoding: 'utf8' });
    fs.writeFileSync('test-results.log', output);
    
    // Step 4: Verify results
    let passed = true;
    
    // Check if build directory exists
    if (!fs.existsSync('build')) {
      error('Build directory was not created');
      passed = false;
    } else {
      success('Build directory was created successfully');
    }
    
    // Check if index.html exists in build directory
    if (!fs.existsSync('build/index.html')) {
      error('index.html was not created in build directory');
      passed = false;
    } else {
      success('index.html was created in build directory');
    }
    
    // Check if mock binary was created
    if (!fs.existsSync('/tmp/mock-esbuild')) {
      error('Mock esbuild binary was not created at /tmp/mock-esbuild');
      passed = false;
    } else {
      success('Mock esbuild binary was created successfully');
      
      // Check if it's executable
      try {
        execSync('/tmp/mock-esbuild');
        success('Mock esbuild binary is executable');
      } catch (err) {
        error(`Mock esbuild binary is not executable: ${err.message}`);
        passed = false;
      }
    }
    
    // Check if .npmrc was created
    if (!fs.existsSync('.npmrc')) {
      error('.npmrc file was not created');
      passed = false;
    } else {
      success('.npmrc file was created successfully');
    }
    
    // Final result
    if (passed) {
      success('All tests PASSED! The Netlify build simulation was successful.');
      log('The fixes for esbuild issues appear to be working correctly.');
    } else {
      error('Some tests FAILED. Check the errors above and the test-results.log file.');
    }
    
    return passed;
  } catch (err) {
    error(`Test execution failed: ${err.message}`);
    if (err.stdout) fs.writeFileSync('test-results.log', err.stdout);
    if (err.stderr) fs.appendFileSync('test-results.log', err.stderr);
    return false;
  }
};

// Run the test
runTest(); 