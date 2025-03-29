import axios from 'axios';

/**
 * Client-side search implementation for NEPs
 * This replaces the Netlify function-based search to avoid build issues
 */

// GitHub repository information
const owner = 'neo-project';
const repo = 'proposals';
const path = 'NEPs';

/**
 * Search for NEPs based on a query string
 * @param {string} query - The search query
 * @returns {Promise<Array>} - Array of matching NEP objects
 */
export const searchNEPs = async (query) => {
  try {
    // Normalize the query
    const normalizedQuery = query.toLowerCase().trim();
    
    if (!normalizedQuery) {
      return [];
    }
    
    // Fetch the list of NEP files from GitHub
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
    );
    
    // Filter out non-markdown files and directories
    const nepFiles = response.data.filter(
      (file) => file.type === 'file' && file.name.endsWith('.md')
    );
    
    // Fetch and process each NEP file
    const searchPromises = nepFiles.map(async (file) => {
      try {
        // Get the raw content of the file
        const contentResponse = await axios.get(file.download_url);
        const content = contentResponse.data;
        
        // Extract NEP number from filename (e.g., NEP-1.md -> 1)
        const nepNumber = file.name.replace('NEP-', '').replace('.md', '');
        
        // Extract title from the content (usually in the format "# NEP-X: Title")
        const titleMatch = content.match(/# NEP-\d+: (.*?)(\r?\n|$)/);
        const title = titleMatch ? titleMatch[1] : 'Unknown Title';
        
        // Extract status from the content
        const statusMatch = content.match(/Status: (.*?)(\r?\n|$)/i);
        const status = statusMatch ? statusMatch[1] : 'Unknown';
        
        // Extract author from the content
        const authorMatch = content.match(/Author: (.*?)(\r?\n|$)/i);
        const author = authorMatch ? authorMatch[1] : 'Unknown';
        
        // Calculate search score
        const score = calculateSearchScore(normalizedQuery, {
          nepNumber,
          title,
          status,
          author,
          content
        });
        
        // Return the NEP with its search score if it's relevant
        if (score > 0) {
          return {
            nepNumber,
            title,
            status,
            author,
            url: file.html_url,
            score
          };
        }
        
        return null;
      } catch (error) {
        console.error(`Error processing NEP file ${file.name}:`, error);
        return null;
      }
    });
    
    // Wait for all promises to resolve
    const results = await Promise.all(searchPromises);
    
    // Filter out null results, sort by score (descending), and return
    return results
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);
      
  } catch (error) {
    console.error('Error searching NEPs:', error);
    throw new Error('Failed to search NEPs. Please try again later.');
  }
};

/**
 * Calculate a relevance score for a NEP based on the search query
 * @param {string} query - The normalized search query
 * @param {Object} nep - The NEP object with content
 * @returns {number} - The relevance score (higher is more relevant)
 */
const calculateSearchScore = (query, nep) => {
  let score = 0;
  
  // Check if query matches NEP number exactly
  if (nep.nepNumber === query) {
    score += 100;
  }
  
  // Check if query is part of NEP number
  if (nep.nepNumber.includes(query)) {
    score += 50;
  }
  
  // Check if query is in title
  if (nep.title.toLowerCase().includes(query)) {
    score += 30;
  }
  
  // Check if query is in author
  if (nep.author.toLowerCase().includes(query)) {
    score += 20;
  }
  
  // Check if query is in status
  if (nep.status.toLowerCase().includes(query)) {
    score += 10;
  }
  
  // Check if query is in content
  if (nep.content.toLowerCase().includes(query)) {
    score += 5;
    
    // Bonus points for multiple occurrences in content
    const occurrences = (nep.content.toLowerCase().match(new RegExp(query, 'g')) || []).length;
    if (occurrences > 1) {
      score += Math.min(occurrences, 10); // Cap at 10 bonus points
    }
  }
  
  return score;
};

export default { searchNEPs };
