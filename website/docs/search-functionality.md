# Search Functionality

## Overview

The Neo N3 Proposals website includes a comprehensive search feature that allows users to find NEPs based on various criteria such as title, number, content, authors, and more. The search functionality is implemented both on the client-side and server-side to ensure optimal performance and reliability.

## Components

### 1. Search Interface

The search interface is integrated into the Header component, allowing users to search from any page in the application. When a user submits a search query, they are redirected to a dedicated SearchPage that displays the results.

**Location**: `/src/components/Header.js`

**Key Features**:
- Input field for search queries
- Form submission that redirects to the search page
- Responsive design for both desktop and mobile views

### 2. Search Page

The SearchPage component displays search results and handles the search logic. It uses the URL query parameters to get the search term and displays matching NEPs in a list format.

**Location**: `/src/pages/SearchPage.js`

**Key Features**:
- Displays search results in a clean, organized list
- Shows relevant metadata for each NEP (number, title, status, type, authors, creation date)
- Handles loading states and error messages
- Empty state when no results are found

### 3. API Service

The search functionality is implemented in the API service, which provides methods for searching NEPs. The service uses a dedicated Netlify function for server-side searching, with a fallback to client-side filtering if the server-side search fails.

**Location**: `/src/services/api.js`

**Key Methods**:
- `searchNEPs(query)`: Searches for NEPs based on the provided query

### 4. Netlify Function

A dedicated Netlify function handles server-side searching, which improves performance by offloading the search operation to the server and reducing the amount of data that needs to be transferred to the client.

**Location**: `/netlify/functions/search-neps.js`

**Key Features**:
- Fetches NEPs from GitHub
- Extracts metadata from NEP files
- Filters NEPs based on the search query
- Returns matching NEPs as JSON

## Search Algorithm

The search algorithm works as follows:

1. The user enters a search query in the search input field in the Header
2. The query is submitted to the SearchPage component via URL parameters
3. The SearchPage calls the `searchNEPs` method from the API service
4. The API service calls the `search-neps` Netlify function with the query
5. The Netlify function:
   - Fetches all NEP files from GitHub
   - Extracts metadata from each NEP file
   - Filters NEPs based on the search query
   - Returns matching NEPs
6. If the server-side search fails, the API service falls back to client-side filtering
7. The SearchPage displays the results to the user

## Search Criteria

NEPs are searched based on the following fields:
- NEP number
- Title
- Type (e.g., Standards Track, Informational)
- Status (e.g., Draft, Final)
- Category (e.g., Core, Interface)
- Authors
- Content preview

## Future Enhancements

Potential future enhancements to the search functionality include:
- Advanced search options (filtering by specific fields)
- Full-text search of NEP content
- Search highlighting to show where matches occur
- Search suggestions based on popular queries
- Search history for returning users

## Usage Example

```javascript
// Example of using the search API in a component
import { nepApi } from '../services/api';

const searchForNEPs = async (query) => {
  try {
    const results = await nepApi.searchNEPs(query);
    console.log(`Found ${results.length} NEPs matching "${query}"`);
    return results;
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
};
```
