#!/bin/bash

# Netlify custom build script to handle esbuild issues

# Print Node.js and npm versions
echo "Using Node.js version: $(node -v)"
echo "Using npm version: $(npm -v)"

# Clean install dependencies
echo "Installing dependencies..."
npm ci

# If npm ci fails, try regular install
if [ $? -ne 0 ]; then
  echo "npm ci failed, trying npm install..."
  npm install
fi

# Build the project
echo "Building the project..."
npm run build

# Exit with the status of the build command
exit $?
