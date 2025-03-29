# Neo N3 Proposals Website Architecture

This document outlines the architecture of the Neo N3 Proposals website, which displays NEPs (Neo Enhancement Proposals) and working NEPs (Pull Requests) from the GitHub repository.

## System Overview

The Neo N3 Proposals website is a modern web application built with React and deployed on Netlify. It fetches data directly from the GitHub repository, displays existing NEPs and working NEPs, and allows users to comment on them.

## Architecture Components

### Frontend

- **Framework**: React.js
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: React Context API

### Backend (Serverless)

- **Netlify Functions**: Serverless functions for API endpoints
- **GitHub API Integration**: Fetch NEPs and PRs from the repository
- **Database**: FaunaDB for storing user comments
- **Authentication**: Auth0 for user authentication

## Data Flow

1. User visits the website
2. Frontend requests data from Netlify Functions
3. Netlify Functions fetch data from GitHub API
4. Data is processed and returned to the frontend
5. Frontend renders the data for the user

## Key Features

### NEP Display
- Fetch NEP content from GitHub repository
- Convert MediaWiki format to HTML
- Display NEP metadata and content

### Working NEPs (PRs)
- Fetch open PRs from GitHub API
- Calculate waiting time
- Display PR metadata and status

### Comment System
- Allow authenticated users to comment on NEPs and PRs
- Store comments in FaunaDB
- Support for replies and moderation

### User Authentication
- Auth0 integration for secure authentication
- User profiles and roles
- Permission-based access control

## Technical Implementation

### GitHub API Integration
```javascript
// Example for fetching NEP content
async function fetchNEPContent(nepNumber) {
  const response = await fetch(
    `https://api.github.com/repos/neo-project/proposals/contents/nep-${nepNumber}.mediawiki`,
    { headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` } }
  );
  const data = await response.json();
  return Buffer.from(data.content, 'base64').toString();
}
```

### MediaWiki Parsing
```javascript
// Example for converting MediaWiki to HTML
function convertMediaWikiToHtml(content) {
  // Implementation using a MediaWiki parser library
  return parsedHtml;
}
```

### Database Schema
```graphql
type User {
  id: ID!
  name: String!
  email: String!
  avatarUrl: String
}

type Comment {
  id: ID!
  nepId: String!
  userId: ID!
  user: User!
  content: String!
  createdAt: Time!
  updatedAt: Time
  parentId: ID
}
```

## Deployment

The website is deployed on Netlify with continuous deployment from the GitHub repository. Environment variables are used for API keys and other sensitive information.