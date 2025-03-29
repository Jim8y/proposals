const { Octokit } = require('@octokit/rest');
const axios = require('axios');

// Initialize Octokit with GitHub token from environment variables
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
    // Fetch all content from the repository
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

    console.log(`Found ${nepFiles.length} NEP files`);

    // Process each NEP file to extract metadata
    const nepsPromises = nepFiles.map(async (file) => {
      try {
        // Get the NEP number from the filename
        const nepNumberMatch = file.name.match(/^nep-(\d+)\.mediawiki$/);
        if (!nepNumberMatch) return null;
        
        const nepNumber = nepNumberMatch[1];
        
        // Get the raw content of the file
        const response = await axios.get(file.download_url);
        const content = response.data;
        
        // Extract metadata from the content using more robust regex patterns
        const titleMatch = content.match(/Title:\s*(.+?)(?=\n|$)/);
        const authorMatch = content.match(/Author:\s*(.+?)(?=\n|$)/);
        const typeMatch = content.match(/Type:\s*(.+?)(?=\n|$)/);
        const statusMatch = content.match(/Status:\s*(.+?)(?=\n|$)/);
        const categoryMatch = content.match(/Category:\s*(.+?)(?=\n|$)/);
        const createdMatch = content.match(/Created:\s*(.+?)(?=\n|$)/);
        
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
          content: content.substring(0, 1000), // Include a preview of the content for searching
          raw_url: file.download_url,
        };
        
        return nep;
      } catch (error) {
        console.error(`Error processing NEP file ${file.name}:`, error);
        return null;
      }
    });

    // Wait for all NEPs to be processed
    let neps = (await Promise.all(nepsPromises)).filter(Boolean);
    
    // Sort NEPs by number (descending) to prioritize newer NEPs
    neps = neps.sort((a, b) => parseInt(b.number) - parseInt(a.number));
    
    // If no query, return all NEPs
    if (!query || query.trim() === '') {
      return neps;
    }
    
    // Normalize the query and split into terms for better matching
    const queryTerms = query.toLowerCase().trim().split(/\s+/).filter(term => term.length > 0);
    
    if (queryTerms.length === 0) {
      return neps;
    }
    
    // Score-based filtering for more accurate results
    const scoredNeps = neps.map(nep => {
      // Create a searchable text from NEP properties
      const searchableText = [
        `NEP-${nep.number}`,
        nep.title,
        nep.type,
        nep.status,
        nep.category,
        Array.isArray(nep.authors) ? nep.authors.join(' ') : '',
        nep.content || ''
      ].filter(Boolean).join(' ').toLowerCase();
      
      // Calculate score based on matches
      let score = 0;
      let exactMatch = false;
      
      // Check for exact NEP number match (highest priority)
      if (queryTerms.some(term => term === nep.number || term === `nep-${nep.number}`)) {
        score += 100;
        exactMatch = true;
      }
      
      // Check for title matches (high priority)
      const titleText = nep.title.toLowerCase();
      if (queryTerms.some(term => titleText.includes(term))) {
        score += 50;
      }
      
      // Check for author matches
      const authorsText = Array.isArray(nep.authors) ? nep.authors.join(' ').toLowerCase() : '';
      if (queryTerms.some(term => authorsText.includes(term))) {
        score += 30;
      }
      
      // Check for status, type, category matches
      if (queryTerms.some(term => 
        (nep.status && nep.status.toLowerCase().includes(term)) ||
        (nep.type && nep.type.toLowerCase().includes(term)) ||
        (nep.category && nep.category.toLowerCase().includes(term))
      )) {
        score += 20;
      }
      
      // Check for content matches (lowest priority)
      if (queryTerms.some(term => searchableText.includes(term))) {
        score += 10;
      }
      
      return { nep, score, exactMatch };
    });
    
    // Filter NEPs with a score > 0 and sort by score (descending)
    const filteredNeps = scoredNeps
      .filter(item => item.score > 0)
      .sort((a, b) => {
        // Prioritize exact matches
        if (a.exactMatch && !b.exactMatch) return -1;
        if (!a.exactMatch && b.exactMatch) return 1;
        // Then sort by score
        return b.score - a.score;
      })
      .map(item => item.nep);
    
    return filteredNeps;
  } catch (error) {
    console.error('Error searching NEPs:', error);
    throw error;
  }
};

exports.handler = async (event) => {
  // Set CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*', // Allow requests from any origin
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };
  
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204, // No content needed for OPTIONS
      headers,
      body: '',
    };
  }
  
  try {
    // Get the search query from the query parameters
    const query = event.queryStringParameters?.q || '';
    
    console.log(`Processing search request with query: "${query}"`);
    
    // Search for NEPs
    const results = await searchNEPs(query);
    
    console.log(`Search completed. Found ${results.length} matching NEPs`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error('Error in search-neps function:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to search NEPs',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
    };
  }
};
