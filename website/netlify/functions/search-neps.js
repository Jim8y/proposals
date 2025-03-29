const { Octokit } = require('@octokit/rest');
const axios = require('axios');

// Initialize Octokit
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// GitHub repository details
const owner = 'neo-project';
const repo = 'proposals';

/**
 * Searches for NEPs based on the provided query
 * @param {string} query - The search query
 * @returns {Array} - Filtered NEPs that match the query
 */
const searchNEPs = async (query) => {
  try {
    // Fetch all NEPs first
    const { data: files } = await octokit.repos.getContent({
      owner,
      repo,
      path: '',
    });

    // Filter NEP files (they follow the pattern nep-X.mediawiki)
    const nepFiles = files.filter(file => 
      file.type === 'file' && 
      file.name.match(/^nep-\d+\.mediawiki$/)
    );

    // Process each NEP file to extract metadata
    const nepsPromises = nepFiles.map(async (file) => {
      try {
        // Get the NEP number from the filename
        const nepNumber = file.name.match(/^nep-(\d+)\.mediawiki$/)[1];
        
        // Get the raw content of the file
        const response = await axios.get(file.download_url);
        const content = response.data;
        
        // Extract metadata from the content
        const titleMatch = content.match(/Title:\s*(.+?)(?=\n)/);
        const authorMatch = content.match(/Author:\s*(.+?)(?=\n)/);
        const typeMatch = content.match(/Type:\s*(.+?)(?=\n)/);
        const statusMatch = content.match(/Status:\s*(.+?)(?=\n)/);
        const categoryMatch = content.match(/Category:\s*(.+?)(?=\n)/);
        const createdMatch = content.match(/Created:\s*(.+?)(?=\n)/);
        
        // Create NEP object with extracted metadata
        const nep = {
          number: nepNumber,
          title: titleMatch ? titleMatch[1].trim() : `NEP-${nepNumber}`,
          authors: authorMatch ? authorMatch[1].split(',').map(author => author.trim()) : [],
          type: typeMatch ? typeMatch[1].trim() : '',
          status: statusMatch ? statusMatch[1].trim() : '',
          category: categoryMatch ? categoryMatch[1].trim() : '',
          created_at: createdMatch ? new Date(createdMatch[1].trim()).toISOString() : '',
          html_url: `https://github.com/${owner}/${repo}/blob/master/${file.name}`,
          content: content.substring(0, 500), // Include a preview of the content for searching
        };
        
        return nep;
      } catch (error) {
        console.error(`Error processing NEP file ${file.name}:`, error);
        return null;
      }
    });

    // Wait for all NEPs to be processed
    const neps = (await Promise.all(nepsPromises)).filter(Boolean);
    
    // If no query, return all NEPs
    if (!query || query.trim() === '') {
      return neps;
    }
    
    // Normalize the query
    const normalizedQuery = query.toLowerCase().trim();
    
    // Filter NEPs based on search criteria
    return neps.filter(nep => {
      // Create a searchable text from NEP properties
      const searchableText = [
        nep.number,
        nep.title,
        nep.type,
        nep.status,
        nep.category,
        Array.isArray(nep.authors) ? nep.authors.join(' ') : '',
        nep.content || ''
      ].filter(Boolean).join(' ').toLowerCase();
      
      return searchableText.includes(normalizedQuery);
    });
  } catch (error) {
    console.error('Error searching NEPs:', error);
    throw error;
  }
};

exports.handler = async (event) => {
  try {
    // Get the search query from the query parameters
    const query = event.queryStringParameters.q || '';
    
    // Search for NEPs
    const results = await searchNEPs(query);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error('Error in search-neps function:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Failed to search NEPs' }),
    };
  }
};
