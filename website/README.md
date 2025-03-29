# Neo N3 Proposals Website

A professional website for browsing, searching, and interacting with Neo Enhancement Proposals (NEPs). This application integrates with the existing GitHub repository, displays NEPs and working NEPs (PRs), allows user comments, and is deployed on Netlify using serverless functions.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Development](#development)
  - [Running Locally](#running-locally)
  - [Available Scripts](#available-scripts)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Browse NEPs**: View a comprehensive list of all Neo Enhancement Proposals
- **NEP Details**: Read the full content of each NEP with proper formatting
- **Working NEPs**: Track NEPs currently in development (open pull requests)
- **Search & Filter**: Find NEPs by title, number, author, or category
- **User Authentication**: Log in using Auth0 to engage with the community
- **Comments**: Discuss NEPs with other community members
- **Responsive Design**: Optimized for desktop and mobile devices
- **GitHub Integration**: Real-time data from the Neo Proposals repository

## Technology Stack

- **Frontend**: React, React Router, Tailwind CSS
- **API Integration**: Axios
- **Authentication**: Auth0
- **Database**: FaunaDB (for comments)
- **Serverless Functions**: Netlify Functions
- **Deployment**: Netlify

## Project Structure

```
website/
├── docs/                     # Documentation files
│   ├── ARCHITECTURE.md       # System architecture
│   ├── API.md                # API endpoints
│   ├── UI_COMPONENTS.md      # UI components
│   └── DEPLOYMENT.md         # Deployment guide
├── netlify/                  # Netlify configuration
│   └── functions/            # Serverless functions
│       ├── get-neps.js       # Fetch all NEPs
│       ├── get-nep.js        # Fetch a specific NEP
│       ├── get-nep-content.js # Fetch NEP content
│       ├── get-working-neps.js # Fetch working NEPs (PRs)
│       ├── get-comments.js   # Fetch comments for a NEP
│       └── add-comment.js    # Add a comment to a NEP
├── public/                   # Static assets
├── src/                      # Source code
│   ├── auth/                 # Authentication
│   ├── components/           # Reusable components
│   ├── pages/                # Page components
│   ├── services/             # API services
│   └── styles/               # CSS styles
├── .env.example              # Environment variables template
├── netlify.toml              # Netlify configuration
├── package.json              # Dependencies and scripts
├── postcss.config.js         # PostCSS configuration
└── tailwind.config.js        # Tailwind CSS configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- GitHub account (for API access)
- Auth0 account (for authentication)
- FaunaDB account (for comments storage)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/neo-project/proposals.git
   cd proposals/website
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Configuration

1. Copy the environment variables template:
   ```bash
   cp .env.example .env.local
   ```

2. Update the environment variables in `.env.local` with your own values:
   - GitHub token for API access
   - Auth0 credentials
   - FaunaDB secret key
   - Site URL and other configuration

## Development

### Running Locally

Start the development server:

```bash
npm start
# or
yarn start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Available Scripts

- `npm start` - Start the development server
- `npm build` - Build the application for production
- `npm test` - Run tests
- `npm run lint` - Run linting checks
- `npm run format` - Format code using Prettier

## API Integration

The website integrates with the following APIs:

1. **GitHub API**: Fetches NEPs and working NEPs (pull requests) from the Neo Proposals repository
2. **Netlify Functions**: Serverless functions that handle API requests and database operations
3. **FaunaDB**: Stores and retrieves user comments on NEPs

For more details on API endpoints, see [API.md](./docs/API.md).

## Authentication

User authentication is handled by Auth0, which provides:

- Secure login and registration
- Social login options (GitHub, Google, etc.)
- JWT tokens for API authentication
- User profile management

## Deployment

The website is deployed on Netlify. For deployment instructions, see [DEPLOYMENT.md](./docs/DEPLOYMENT.md).

## Documentation

- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - System architecture
- [API.md](./docs/API.md) - API endpoints
- [UI_COMPONENTS.md](./docs/UI_COMPONENTS.md) - UI components
- [DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Deployment guide

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
