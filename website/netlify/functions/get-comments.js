const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async function(event, context) {
  try {
    // Set CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // Get NEP number from query parameters
    const nepNumber = event.queryStringParameters.nepNumber;
    if (!nepNumber) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'NEP number is required' })
      };
    }

    // Initialize FaunaDB client
    const client = new faunadb.Client({
      secret: process.env.FAUNA_SECRET
    });

    // Query comments for the specified NEP
    const result = await client.query(
      q.Map(
        q.Paginate(
          q.Match(q.Index('comments_by_nep'), nepNumber),
          { size: 100 } // Limit to 100 comments per NEP
        ),
        q.Lambda('ref', q.Get(q.Var('ref')))
      )
    );

    // Transform the data to a more usable format
    const comments = result.data.map(item => ({
      id: item.ref.id,
      nepNumber: item.data.nepNumber,
      content: item.data.content,
      author: item.data.author,
      createdAt: item.data.createdAt
    }));

    // Sort comments by creation date (oldest first)
    comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(comments)
    };
  } catch (error) {
    console.error('Error fetching comments:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Failed to fetch comments' })
    };
  }
};
