# Updating the Static Site Content

This guide explains how to update the Neo N3 Proposals website content using our static site deployment approach.

## Overview

Our website is now deployed as a fully static site to avoid dependency issues with tools like esbuild. This means:

1. There is no build-time processing of React components or JSX
2. Content is stored directly in HTML files and static assets
3. Updates require manual editing of the static HTML content

## File Structure

The key files for content updates are:

- `website/static-index.html` - The main HTML file for the site
- `website/public/` - Directory for static assets like images, CSS, and client-side JS
- `website/build-static.js` - Script that builds the site by copying files to the `build` directory

## How to Update Content

### Basic Content Updates

To make basic content updates (text changes, adding new proposals, etc.):

1. Edit the `website/static-index.html` file directly
2. Test locally by running:
   ```bash
   cd website
   node build-static.js
   npx serve build  # or any other local server
   ```
3. Commit and push your changes to deploy

### Adding New Proposals

To add a new proposal to the featured list:

1. Open `website/static-index.html`
2. Locate the "Featured Proposals" section
3. Copy one of the existing proposal card templates:

```html
<!-- NEP-X -->
<div class="flex flex-col rounded-lg shadow-lg overflow-hidden">
  <div class="flex-1 bg-white p-6 flex flex-col justify-between">
    <div class="flex-1">
      <p class="text-sm font-medium text-green-600">
        NEP-X
      </p>
      <a href="https://github.com/neo-project/proposals/blob/master/nep-X.mediawiki" class="block mt-2">
        <p class="text-xl font-semibold text-gray-900">Title Goes Here</p>
        <p class="mt-3 text-base text-gray-500">
          Description of the NEP goes here.
        </p>
      </a>
    </div>
    <div class="mt-6 flex items-center">
      <div class="flex-shrink-0">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Status
        </span>
      </div>
    </div>
  </div>
</div>
```

4. Update the NEP number, title, description, status, and link
5. Add the new card to the grid
6. Test and deploy as described above

### Adding Static Assets

To add new images or other static assets:

1. Place the files in the `website/public` directory
2. Reference them in the HTML using relative paths:
   ```html
   <img src="/images/my-new-image.png" alt="Description">
   ```
3. They will be copied to the build directory by the `build-static.js` script
4. Test and deploy as described above

### Modifying Styles

The site uses Tailwind CSS loaded from a CDN. To modify styles:

1. Make changes directly in the HTML using Tailwind utility classes
2. For custom styles, add them within a `<style>` tag in the `<head>` section
3. Alternatively, add a custom CSS file to `public/css/` and link to it in the HTML

## Local Testing

To test your changes locally:

1. Run the build script:
   ```bash
   cd website
   node build-static.js
   ```

2. Serve the built files:
   ```bash
   npx serve build
   # or
   cd build && python -m http.server 8000
   ```

3. Open a browser and navigate to `http://localhost:3000` (or appropriate port)

## Deployment

Deployment happens automatically when changes are pushed to the repository:

1. Netlify runs the `netlify-build.sh` script
2. The script executes `build-static.js`
3. Files are copied from `public/` to `build/`
4. `static-index.html` is copied to `build/index.html`
5. The `build/` directory is deployed to Netlify

## SEO and Metadata

To update SEO metadata:

1. Edit the `<head>` section of `static-index.html`
2. Update the title, description, and other meta tags as needed:
   ```html
   <meta name="description" content="Updated description for better SEO">
   <title>Updated Page Title</title>
   ```

## Troubleshooting

If you encounter issues:

1. **Build errors** - Check the Netlify logs for specific error messages
2. **Missing content** - Ensure all files are in the correct directories
3. **Layout issues** - Validate your HTML and check browser dev tools for CSS conflicts
4. **Deployment problems** - Check the `netlify.toml` and `netlify-build.sh` files

## Migrating to a More Advanced Solution

When ready to move beyond this simple static approach:

1. Consider using a static site generator like 11ty, Hugo, or Next.js static export
2. Keep the content in Markdown files for easier maintenance
3. Set up a build process that doesn't rely on problematic dependencies
4. Update the `netlify-build.sh` script to use the new build process
5. Test thoroughly before deploying to production

## Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [HTML5 Semantic Elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [Netlify Documentation](https://docs.netlify.com/) 