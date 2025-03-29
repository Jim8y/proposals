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
  if (fs.existsSync(sourceDir)) {
    execSync(`cp -R ${sourceDir}/* ${buildDir}/`);
    console.log('Successfully copied public files to build directory');
  } else {
    console.warn('Public directory not found, creating empty build directory');
  }
} catch (error) {
  console.error('Error copying public files:', error);
  console.log('Continuing with build process...');
}

// Copy our static index.html to the build directory
console.log('Copying static index.html to build directory...');
try {
  if (fs.existsSync(staticIndexHtmlPath)) {
    fs.copyFileSync(staticIndexHtmlPath, path.join(buildDir, 'index.html'));
    console.log('Successfully copied static index.html to build directory');
  } else {
    console.warn('static-index.html not found, creating fallback index.html');
    const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="Neo N3 Proposals Website" />
  <title>Neo N3 Proposals</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #00e599; text-align: center; }
    .content { background: #f9f9f9; border-radius: 8px; padding: 20px; margin-top: 30px; }
    .footer { margin-top: 50px; text-align: center; font-size: 0.8rem; color: #666; }
    a { color: #00e599; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Neo N3 Proposals</h1>
  <div class="content">
    <h2>Welcome to the Neo N3 Proposals Website</h2>
    <p>This is a placeholder page. The full website is currently being updated.</p>
    <p>To view all NEPs, please visit the <a href="https://github.com/neo-project/proposals">GitHub repository</a>.</p>
  </div>
  <div class="footer">
    &copy; ${new Date().getFullYear()} Neo Foundation. All rights reserved.
  </div>
</body>
</html>`;
    fs.writeFileSync(path.join(buildDir, 'index.html'), fallbackHtml);
    console.log('Created fallback index.html file');
  }
} catch (error) {
  console.error('Error with index.html:', error);
  process.exit(1);
}

console.log('Static build completed successfully!');
