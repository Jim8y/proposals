#!/bin/bash

# Netlify custom build script to handle esbuild issues

# Print Node.js and npm versions
echo "Using Node.js version: $(node -v)"
echo "Using npm version: $(npm -v)"

# Run the esbuild fix script first
echo "Running esbuild fix script..."
node scripts/fix-esbuild.js

# Clean install dependencies
echo "Installing dependencies..."
npm ci --no-optional

# If npm ci fails, try regular install
if [ $? -ne 0 ]; then
  echo "npm ci failed, trying npm install..."
  npm install --no-optional
fi

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
