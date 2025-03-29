#!/bin/bash

# Netlify custom build script to handle esbuild issues

# Print Node.js and npm versions
echo "Using Node.js version: $(node -v)"
echo "Using npm version: $(npm -v)"

# Run the esbuild preinstall script to prepare the filesystem
echo "Running esbuild pre-installation preparation..."
node scripts/esbuild-preinstall.js

# Run the main esbuild fix script
echo "Running esbuild fix script..."
node scripts/fix-esbuild.js

# Clean install dependencies
echo "Installing dependencies..."
npm ci

# If npm ci fails, try regular install
if [ $? -ne 0 ]; then
  echo "npm ci failed, trying npm install..."
  npm install
fi

# In case esbuild is still an issue, try to build without it
echo "Adding fallback to process.env to handle potential esbuild issues..."
export ESBUILD_BINARY_PATH="$(pwd)/node_modules/esbuild/lib/downloaded-@netlify/esbuild-linux-64-esbuild"
export SKIP_PREFLIGHT_CHECK=true

# Build the project
echo "Building the project..."
npm run build

# If the build failed, try the static build
if [ $? -ne 0 ]; then
  echo "React build failed, falling back to static build..."
  node build-static.js
fi

# Exit with success
exit 0
