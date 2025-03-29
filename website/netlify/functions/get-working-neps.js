const axios = require('axios');

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

    // Fetch open pull requests from the GitHub repository
    const response = await axios.get(
      'https://api.github.com/repos/neo-project/proposals/pulls?state=open',
      { headers: githubHeaders }
    );

    // Filter and transform the pull requests data
    const workingNEPs = response.data.map(pr => {
      // Extract NEP number from title if possible
      let nepNumber = null;
      const nepMatch = pr.title.match(/NEP-(\d+)/i);
      if (nepMatch) {
        nepNumber = nepMatch[1];
      }

      return {
        id: pr.id,
        number: pr.number,
        nepNumber: nepNumber,
        title: pr.title,
        html_url: pr.html_url,
        user: {
          login: pr.user.login,
          avatar_url: pr.user.avatar_url,
          html_url: pr.user.html_url
        },
        created_at: pr.created_at,
        updated_at: pr.updated_at,
        state: pr.state,
        draft: pr.draft,
        labels: pr.labels,
        body: pr.body,
        comments: pr.comments
      };
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(workingNEPs)
    };
  } catch (error) {
    console.error('Error fetching working NEPs:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Failed to fetch working NEPs' })
    };
  }
};
