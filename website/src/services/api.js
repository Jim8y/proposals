import axios from 'axios';
import { searchNEPs } from './clientSearch';

// GitHub repository information
const owner = 'neo-project';
const repo = 'proposals';
const path = 'NEPs';

// Base API client configuration for GitHub API
const githubApiClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github.v3+json'
  }
});

// NEP-related API calls
export const nepApi = {
  // Get all NEPs
  getAllNEPs: async () => {
    try {
      const response = await githubApiClient.get(`/repos/${owner}/${repo}/contents/${path}`);
      
      // Filter out non-markdown files and directories
      const nepFiles = response.data.filter(
        (file) => file.type === 'file' && file.name.endsWith('.md')
      );
      
      // Process each NEP file to extract metadata
      const nepsPromises = nepFiles.map(async (file) => {
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
          
          return {
            nepNumber,
            title,
            status,
            author,
            url: file.html_url,
            download_url: file.download_url
          };
        } catch (error) {
          console.error(`Error processing NEP file ${file.name}:`, error);
          return null;
        }
      });
      
      // Wait for all promises to resolve and filter out null results
      const neps = (await Promise.all(nepsPromises)).filter(Boolean);
      
      // Sort by NEP number (ascending)
      return neps.sort((a, b) => parseInt(a.nepNumber) - parseInt(b.nepNumber));
    } catch (error) {
      console.error('Error fetching NEPs:', error);
      throw error;
    }
  },

  // Get a specific NEP by number
  getNEP: async (nepNumber) => {
    try {
      // Get all NEPs first
      const allNEPs = await nepApi.getAllNEPs();
      
      // Find the specific NEP
      const nep = allNEPs.find(n => n.nepNumber === nepNumber);
      
      if (!nep) {
        throw new Error(`NEP ${nepNumber} not found`);
      }
      
      return nep;
    } catch (error) {
      console.error(`Error fetching NEP ${nepNumber}:`, error);
      throw error;
    }
  },

  // Get the content of a specific NEP
  getNEPContent: async (nepNumber) => {
    try {
      // Get the NEP metadata first
      const nep = await nepApi.getNEP(nepNumber);
      
      // Fetch the content using the download_url
      const response = await axios.get(nep.download_url);
      
      return {
        content: response.data,
        ...nep
      };
    } catch (error) {
      console.error(`Error fetching NEP ${nepNumber} content:`, error);
      throw error;
    }
  },

  // Get all working NEPs (pull requests)
  getWorkingNEPs: async () => {
    try {
      // Fetch open pull requests from GitHub
      const response = await githubApiClient.get(`/repos/${owner}/${repo}/pulls`, {
        params: {
          state: 'open',
          sort: 'created',
          direction: 'desc'
        }
      });
      
      // Process each pull request to extract relevant information
      const workingNEPs = response.data.map(pr => ({
        number: pr.number,
        title: pr.title,
        author: pr.user.login,
        created_at: pr.created_at,
        updated_at: pr.updated_at,
        url: pr.html_url,
        branch: pr.head.ref,
        status: 'Draft' // Assuming all PRs are drafts
      }));
      
      return workingNEPs;
    } catch (error) {
      console.error('Error fetching working NEPs:', error);
      throw error;
    }
  },
  
  // Search NEPs by query - now using client-side implementation
  searchNEPs
};

// Comment-related API calls
export const commentApi = {
  // Get comments for a specific NEP
  getComments: async (nepNumber) => {
    try {
      // Fetch comments from GitHub issues
      const response = await githubApiClient.get(`/repos/${owner}/${repo}/issues/${nepNumber}/comments`);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for NEP ${nepNumber}:`, error);
      throw error;
    }
  },

  // Add a new comment to a NEP
  addComment: async (commentData) => {
    try {
      // Post a new comment to GitHub issues
      const response = await githubApiClient.post(`/repos/${owner}/${repo}/issues/${commentData.nepNumber}/comments`, {
        body: commentData.comment
      });
      
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
