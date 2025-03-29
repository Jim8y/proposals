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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(content)
    };
  } catch (error) {
    console.error(`Error fetching NEP content:`, error);
    
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
      body: JSON.stringify({ error: 'Failed to fetch NEP content' })
    };
  }
};
