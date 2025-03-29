# Netlify Build Issues and Solutions

## Overview
This document outlines specific build issues encountered when deploying the Neo N3 Proposals website to Netlify and the solutions implemented to resolve them.

## Issue: esbuild Dependency Errors

### Problem Description
When deploying to Netlify, the build process fails with errors related to the `@netlify/esbuild-linux-64` package:

```
npm ERR! [esbuild] Failed to find package "@netlify/esbuild-linux-64" on the file system
npm ERR! [esbuild] Failed to install package "@netlify/esbuild-linux-64" using npm: ENOENT: no such file or directory
npm ERR! Error: Failed to install package "@netlify/esbuild-linux-64"
```

This error occurs because of compatibility issues between the Node.js version, npm, and the esbuild package during the Netlify build process.

### Solution Implemented

1. **Specified Node.js Version**
   - Set Node.js to version 16.14.0 in the `netlify.toml` file
   - Updated the `engines` field in `package.json` to match this version

2. **Modified Build Command**
   - Added `CI=` prefix to the build command to disable CI mode for React builds
   - This prevents treating warnings as errors during the build process

3. **Added NPM Flags**
   - Set `NPM_FLAGS = "--legacy-peer-deps"` in the build environment
   - This helps resolve dependency conflicts during installation

### Implementation Details

#### netlify.toml Configuration
```toml
[build]
  command = "CI= npm run build"
  publish = "build"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "16.14.0"
  NPM_FLAGS = "--legacy-peer-deps"
```

#### package.json Configuration
```json
"engines": {
  "node": "16.x"
}
```

## Other Common Netlify Build Issues

### React Build Treating Warnings as Errors
In CI environments, Create React App treats warnings as errors by default, which can cause builds to fail.

**Solution**: Use `CI=` prefix before the build command to disable this behavior.

### Dependency Conflicts
Newer packages may require Node.js versions that conflict with Netlify's build environment.

**Solution**: Use the `--legacy-peer-deps` flag to ignore peer dependency conflicts.

### Path Length Issues
Windows has path length limitations that can cause issues when deploying from Windows machines.

**Solution**: Use shorter folder names or deploy from a Linux/Mac environment.

## Testing the Build Locally

To test if your build will work on Netlify before deploying:

1. Install the Netlify CLI: `npm install -g netlify-cli`
2. Run a local build: `netlify build`
3. Check for any errors in the build process

## References

1. [Netlify Build Documentation](https://docs.netlify.com/configure-builds/overview/)
2. [Create React App Deployment](https://create-react-app.dev/docs/deployment/#netlify)
3. [esbuild Documentation](https://esbuild.github.io/)
4. [Netlify Community Forum - esbuild issues](https://answers.netlify.com/t/esbuild-failed-to-install-correctly/39203)
