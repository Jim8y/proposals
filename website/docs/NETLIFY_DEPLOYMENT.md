# Netlify Deployment Configuration

## Overview
This document outlines the configuration for deploying the Neo N3 Proposals website to Netlify, including how to resolve common build errors and ensure a successful deployment.

## Configuration Files

### 1. netlify.toml
The `netlify.toml` file contains the build settings for Netlify:

```toml
[build]
  command = "bash ./netlify-build.sh"
  publish = "build"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18.17.0"

[dev]
  command = "npm run start"
  port = 8888
  targetPort = 3000
  publish = "build"
  autoLaunch = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### 2. package.json
The `package.json` file includes an `engines` field to specify the Node.js version:

```json
"engines": {
  "node": "18.x"
}
```

### 3. Custom Build Script (netlify-build.sh)
We've created a custom build script to handle potential issues with the Netlify build process:

```bash
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
```

### 4. Functions Package.json
A separate `package.json` file in the `netlify/functions` directory ensures the functions use the correct dependencies:

```json
{
  "name": "neo-n3-proposals-functions",
  "version": "1.0.0",
  "description": "Netlify functions for Neo N3 Proposals website",
  "engines": {
    "node": "18.x"
  },
  "dependencies": {
    "@octokit/rest": "^21.1.1",
    "axios": "^1.4.0"
  }
}
```

## Common Build Issues

### esbuild Compatibility Error
The error related to `@netlify/esbuild-linux-64` is a common issue when deploying to Netlify. This occurs because the esbuild package may not be compatible with certain Node.js versions.

**Solution:**
1. Use Node.js 18.x (specifically 18.17.0) which is compatible with both the application dependencies and Netlify's build process
2. Implement a custom build script (`netlify-build.sh`) that handles potential installation issues
3. Add a separate `package.json` file for Netlify functions to ensure they use the correct dependencies

## Environment Variables
For the website to function correctly on Netlify, ensure the following environment variables are set in the Netlify dashboard:

1. `GITHUB_TOKEN` - A GitHub personal access token for accessing the repository data (required for search functionality)

## Deployment Steps
1. Push the code to your GitHub repository
2. Connect the repository to Netlify
3. Configure the build settings:
   - Build command: `bash ./netlify-build.sh` (using our custom script)
   - Publish directory: `build`
   - Functions directory: `netlify/functions`
4. Set the required environment variables in the Netlify dashboard
5. Deploy the site

## Troubleshooting
If you encounter build errors:
1. Check the Netlify build logs for specific error messages
2. Ensure the Node.js version is set correctly (18.17.0 is recommended)
3. Verify that the custom build script has execute permissions (`chmod +x netlify-build.sh`)
4. Try clearing the Netlify cache and redeploying
5. If issues persist with specific dependencies, consider adding them to the functions `package.json` file
