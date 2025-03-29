const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async function(event, context) {
  // Set CORS headers for preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Handle POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const data = JSON.parse(event.body);
    
    // Validate required fields
    if (!data.nepNumber || !data.content || !data.author) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Missing required fields: nepNumber, content, author' })
      };
    }

    // Initialize FaunaDB client
    const client = new faunadb.Client({
      secret: process.env.FAUNA_SECRET
    });

    // Prepare comment data
    const commentData = {
      nepNumber: data.nepNumber,
      content: data.content,
      author: {
        name: data.author.name,
        picture: data.author.picture
      },
      createdAt: new Date().toISOString()
    };

    // Create the comment in FaunaDB
    const result = await client.query(
      q.Create(
        q.Collection('comments'),
        { data: commentData }
      )
    );

    // Return the created comment with its ID
    const comment = {
      id: result.ref.id,
      ...commentData
    };

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comment)
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Failed to add comment' })
    };
  }
};
