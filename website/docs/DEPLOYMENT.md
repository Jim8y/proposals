# Neo N3 Proposals Website Deployment Guide

This document outlines the deployment process for the Neo N3 Proposals website on Netlify, including environment setup, build configuration, and continuous deployment.

## Prerequisites

Before deploying the website, you need:

1. A GitHub account with access to the Neo N3 proposals repository
2. A Netlify account
3. An Auth0 account for authentication
4. A FaunaDB account for the comment system

## Environment Variables

The following environment variables need to be set in Netlify:

```
# GitHub API
GITHUB_TOKEN=your_github_token

# Auth0
AUTH0_DOMAIN=your_auth0_domain
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
AUTH0_CALLBACK_URL=https://your-site.netlify.app/.netlify/functions/auth-callback
AUTH0_LOGOUT_URL=https://your-site.netlify.app

# FaunaDB
FAUNA_SECRET=your_fauna_secret_key

# Site
SITE_URL=https://your-site.netlify.app
```

## Netlify Configuration

Create a `netlify.toml` file in the root of the project with the following content:

```toml
[build]
  command = "npm run build"
  publish = "build"
  functions = "netlify/functions"

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

## FaunaDB Setup

1. Create a new database in FaunaDB
2. Create the following collections:
   - `users`
   - `comments`
3. Create the following indexes:
   - `comments_by_nep_id`: Index comments by `nep_id`
   - `comments_by_user_id`: Index comments by `user_id`
   - `users_by_auth_id`: Index users by `auth_id`
4. Generate a server key and use it as the `FAUNA_SECRET` environment variable

## Auth0 Setup

1. Create a new application in Auth0
2. Configure the application:
   - Application Type: Single Page Application
   - Allowed Callback URLs: `https://your-site.netlify.app/.netlify/functions/auth-callback`
   - Allowed Logout URLs: `https://your-site.netlify.app`
   - Allowed Web Origins: `https://your-site.netlify.app`
3. Create an API in Auth0 to represent your backend
4. Configure the API:
   - Enable RBAC
   - Add permissions for commenting and moderation

## Continuous Deployment

1. Connect your GitHub repository to Netlify
2. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
3. Configure environment variables in Netlify
4. Enable automatic deploys for the main branch

## Manual Deployment

If you prefer to deploy manually:

1. Build the project locally:
   ```
   npm run build
   ```
2. Deploy to Netlify using the Netlify CLI:
   ```
   netlify deploy --prod
   ```

## Post-Deployment Verification

After deploying the website, verify:

1. The website loads correctly
2. NEPs are fetched and displayed properly
3. Working NEPs (PRs) are displayed with waiting time
4. Authentication works (login/logout)
5. Comments can be added and retrieved
6. All pages are responsive and work on mobile devices

## Troubleshooting

### Rate Limiting

If you encounter GitHub API rate limiting issues:

1. Ensure your GitHub token has the correct permissions
2. Implement caching for GitHub API responses
3. Consider using conditional requests with ETags

### CORS Issues

If you encounter CORS issues:

1. Verify your Auth0 and FaunaDB configurations
2. Check Netlify Functions headers
3. Use the Netlify Dev environment to test locally

### Authentication Issues

If authentication doesn't work:

1. Verify Auth0 configuration and callback URLs
2. Check environment variables
3. Inspect browser console for errors
4. Verify JWT validation in Netlify Functions