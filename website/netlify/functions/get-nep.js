const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    // Set CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // Get NEP number from query parameters
    const nepNumber = event.queryStringParameters.number;
    if (!nepNumber) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'NEP number is required' })
      };
    }

    // Get GitHub token from environment variable
    const githubToken = process.env.GITHUB_TOKEN;
    
    // Configure headers for GitHub API request
    const githubHeaders = {};
    if (githubToken) {
      githubHeaders.Authorization = `token ${githubToken}`;
    }

    // Fetch the NEP file content from GitHub
    const fileUrl = `https://api.github.com/repos/neo-project/proposals/contents/nep-${nepNumber}.mediawiki`;
    const response = await axios.get(fileUrl, { headers: githubHeaders });
    
    // Decode the content from base64
    const content = Buffer.from(response.data.content, 'base64').toString();
    
    // Extract metadata from the content
    const title = extractMetadata(content, 'Title') || `NEP-${nepNumber}`;
    const status = extractMetadata(content, 'Status') || 'Unknown';
    const authors = extractMetadata(content, 'Author')?.split(',').map(a => a.trim()) || [];
    const type = extractMetadata(content, 'Type') || 'Standards Track';
    const category = extractMetadata(content, 'Category') || '';
    
    // Extract related NEPs if any
    const requires = extractRelatedNEPs(content, 'Requires');
    const replaces = extractRelatedNEPs(content, 'Replaces');
    const superseded_by = extractRelatedNEPs(content, 'Superseded-By');
    
    // Get commit history to determine creation date
    const commitsResponse = await axios.get(
      `https://api.github.com/repos/neo-project/proposals/commits?path=nep-${nepNumber}.mediawiki`,
      { headers: githubHeaders }
    );
    
    // Use the earliest commit date as the creation date
    const created_at = commitsResponse.data.length > 0 
      ? commitsResponse.data[commitsResponse.data.length - 1].commit.author.date
      : new Date().toISOString();
    
    // Construct the NEP object
    const nep = {
      number: nepNumber,
      title: title,
      status: status,
      authors: authors,
      type: type,
      category: category,
      created_at: created_at,
      html_url: `https://github.com/neo-project/proposals/blob/master/nep-${nepNumber}.mediawiki`,
      requires: requires,
      replaces: replaces,
      superseded_by: superseded_by
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(nep)
    };
  } catch (error) {
    console.error(`Error fetching NEP:`, error);
    
    // Handle 404 errors specifically
    if (error.response && error.response.status === 404) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'NEP not found' })
      };
    }
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Failed to fetch NEP' })
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

// Helper function to extract related NEPs
function extractRelatedNEPs(content, field) {
  const value = extractMetadata(content, field);
  if (!value) return [];
  
  // Extract NEP numbers from the value
  const nepNumbers = [];
  const regex = /\bNEP-?(\d+)\b/gi;
  let match;
  
  while ((match = regex.exec(value)) !== null) {
    nepNumbers.push(match[1]);
  }
  
  return nepNumbers;
}
