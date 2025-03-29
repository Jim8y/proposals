const axios = require('axios');

// Function to fetch all NEPs from GitHub
exports.handler = async function(event, context) {
  try {
    // Set CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // Get GitHub token from environment variable
    const githubToken = process.env.GITHUB_TOKEN;
    
    // Configure headers for GitHub API request
    const githubHeaders = {};
    if (githubToken) {
      githubHeaders.Authorization = `token ${githubToken}`;
    }

    // Fetch files from the GitHub repository
    const response = await axios.get(
      'https://api.github.com/repos/neo-project/proposals/contents',
      { headers: githubHeaders }
    );

    // Filter for NEP files (those matching nep-*.mediawiki pattern)
    const nepFiles = response.data.filter(file => 
      file.type === 'file' && 
      file.name.match(/^nep-\d+\.mediawiki$/)
    );

    // Extract NEP data from each file
    const neps = await Promise.all(
      nepFiles.map(async file => {
        try {
          // Get the NEP number from the filename
          const nepNumber = file.name.match(/^nep-(\d+)\.mediawiki$/)[1];
          
          // Fetch the file content to extract metadata
          const contentResponse = await axios.get(file.url, { headers: githubHeaders });
          const content = Buffer.from(contentResponse.data.content, 'base64').toString();
          
          // Extract metadata from the content
          const title = extractMetadata(content, 'Title') || `NEP-${nepNumber}`;
          const status = extractMetadata(content, 'Status') || 'Unknown';
          const authors = extractMetadata(content, 'Author')?.split(',').map(a => a.trim()) || [];
          const type = extractMetadata(content, 'Type') || 'Standards Track';
          const category = extractMetadata(content, 'Category') || '';
          
          // Get commit history to determine creation date
          const commitsResponse = await axios.get(
            `https://api.github.com/repos/neo-project/proposals/commits?path=${file.path}`,
            { headers: githubHeaders }
          );
          
          // Use the earliest commit date as the creation date
          const created_at = commitsResponse.data.length > 0 
            ? commitsResponse.data[commitsResponse.data.length - 1].commit.author.date
            : new Date().toISOString();
          
          return {
            number: nepNumber,
            title: title,
            status: status,
            authors: authors,
            type: type,
            category: category,
            created_at: created_at,
            html_url: `https://github.com/neo-project/proposals/blob/master/${file.path}`,
            path: file.path
          };
        } catch (error) {
          console.error(`Error processing NEP ${file.name}:`, error);
          return null;
        }
      })
    );

    // Filter out any null values from errors
    const validNeps = neps.filter(nep => nep !== null);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(validNeps)
    };
  } catch (error) {
    console.error('Error fetching NEPs:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Failed to fetch NEPs' })
    };
  }
};

// Helper function to extract metadata from NEP content
function extractMetadata(content, field) {
  // Try to match the field in the header section
  const regex = new RegExp(`^\\s*${field}:\\s*(.+?)\\s*$`, 'm');
  const match = content.match(regex);
  return match ? match[1] : null;
}