# Netlify Deployment Configuration

## Overview
This document outlines the configuration for deploying the Neo N3 Proposals website to Netlify, including how to resolve common build errors and ensure a successful deployment.

## Configuration Files

### 1. netlify.toml
The `netlify.toml` file contains the build settings for Netlify:

```toml
[build]
  command = "npm run build"
  publish = "build"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "16.14.0"
  NPM_FLAGS = "--no-optional"

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
  "node": "16.x"
}
```

## Common Build Issues

### esbuild Compatibility Error
The error related to `@netlify/esbuild-linux-64` is a common issue when deploying to Netlify with newer Node.js versions. This occurs because the esbuild package may not be compatible with the latest Node.js version used by Netlify.

**Solution:**
1. Specify an older, compatible Node.js version (16.x) in both `package.json` and `netlify.toml`
2. Add `NPM_FLAGS = "--no-optional"` to the build environment settings in `netlify.toml`

## Environment Variables
For the website to function correctly on Netlify, ensure the following environment variables are set in the Netlify dashboard:

1. `GITHUB_TOKEN` - A GitHub personal access token for accessing the repository data (required for search functionality)

## Deployment Steps
1. Push the code to your GitHub repository
2. Connect the repository to Netlify
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Functions directory: `netlify/functions`
4. Set the required environment variables in the Netlify dashboard
5. Deploy the site

## Troubleshooting
If you encounter build errors:
1. Check the Netlify build logs for specific error messages
2. Ensure the Node.js version is set correctly in both `package.json` and `netlify.toml`
3. Verify that all dependencies are compatible with the specified Node.js version
4. Consider using `npm ci` instead of `npm install` for more reliable builds
