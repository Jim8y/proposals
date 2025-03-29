import axios from 'axios';

// Base API client configuration
const apiClient = axios.create({
  baseURL: '/.netlify/functions',
  headers: {
    'Content-Type': 'application/json'
  }
});

// NEP-related API calls
export const nepApi = {
  // Get all NEPs
  getAllNEPs: async () => {
    try {
      const response = await apiClient.get('/get-neps');
      return response.data;
    } catch (error) {
      console.error('Error fetching NEPs:', error);
      throw error;
    }
  },

  // Get a specific NEP by number
  getNEP: async (nepNumber) => {
    try {
      const response = await apiClient.get(`/get-nep?number=${nepNumber}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching NEP ${nepNumber}:`, error);
      throw error;
    }
  },

  // Get the content of a specific NEP
  getNEPContent: async (nepNumber) => {
    try {
      const response = await apiClient.get(`/get-nep-content?number=${nepNumber}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching NEP ${nepNumber} content:`, error);
      throw error;
    }
  },

  // Get all working NEPs (pull requests)
  getWorkingNEPs: async () => {
    try {
      const response = await apiClient.get('/get-working-neps');
      return response.data;
    } catch (error) {
      console.error('Error fetching working NEPs:', error);
      throw error;
    }
  },
  
  // Search NEPs by query
  searchNEPs: async (query) => {
    try {
      // Use the dedicated search-neps Netlify function
      const response = await apiClient.get(`/search-neps?q=${encodeURIComponent(query || '')}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching NEPs with query "${query}":`, error);
      
      // Fallback to client-side search if server-side search fails
      try {
        // Get all NEPs
        const allNEPs = await nepApi.getAllNEPs();
        
        // If no query, return all NEPs
        if (!query || query.trim() === '') {
          return allNEPs;
        }
        
        // Normalize the query
        const normalizedQuery = query.toLowerCase().trim();
        
        // Filter NEPs based on search criteria
        return allNEPs.filter(nep => {
          // Create a searchable text from NEP properties
          const searchableText = [
            nep.number,
            nep.title,
            nep.type,
            nep.status,
            nep.category,
            Array.isArray(nep.authors) ? nep.authors.join(' ') : '',
            nep.description || ''
          ].filter(Boolean).join(' ').toLowerCase();
          
          return searchableText.includes(normalizedQuery);
        });
      } catch (fallbackError) {
        console.error('Fallback search also failed:', fallbackError);
        throw error; // Throw the original error
      }
    }
  }
};

// Comment-related API calls
export const commentApi = {
  // Get comments for a specific NEP
  getComments: async (nepNumber) => {
    try {
      const response = await apiClient.get(`/get-comments?nepNumber=${nepNumber}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for NEP ${nepNumber}:`, error);
      throw error;
    }
  },

  // Add a new comment to a NEP
  addComment: async (commentData) => {
    try {
      const response = await apiClient.post('/add-comment', commentData);
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }
};

// Export all API services
const apiServices = {
  nep: nepApi,
  comment: commentApi
};

export default apiServices;
