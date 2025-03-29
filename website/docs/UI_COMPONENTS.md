# Neo N3 Proposals Website UI Components

This document outlines the UI components for the Neo N3 Proposals website, their purpose, and their relationships.

## Layout Components

### AppLayout

**Purpose:** Main layout component that wraps all pages and provides consistent structure.

**Features:**
- Header with navigation
- Main content area
- Footer
- Responsive design

### Header

**Purpose:** Top navigation bar with links to main sections and user authentication.

**Features:**
- Neo logo
- Navigation links (Home, NEPs, Working NEPs, About)
- Search bar
- User authentication controls (Login/Logout)

### Footer

**Purpose:** Bottom section with additional links and information.

**Features:**
- Copyright information
- Links to Neo resources
- GitHub repository link
- Contact information

## Page Components

### HomePage

**Purpose:** Landing page for the website.

**Features:**
- Hero section with explanation of NEPs
- Featured NEPs section
- Recent activity section
- Quick links to important NEPs

### NEPsListPage

**Purpose:** Page displaying all existing NEPs.

**Features:**
- Filterable and sortable table of NEPs
- Search functionality
- Status indicators
- Pagination

### NEPDetailPage

**Purpose:** Page displaying the details of a specific NEP.

**Features:**
- NEP metadata (number, title, author, type, status)
- NEP content in HTML format
- Comments section
- Related NEPs

### WorkingNEPsPage

**Purpose:** Page displaying all working NEPs (open PRs).

**Features:**
- List of open PRs with metadata
- Waiting time indicators
- Status badges
- Comments section

### AboutPage

**Purpose:** Page explaining the NEP process and how to contribute.

**Features:**
- Explanation of the NEP process
- Guidelines for contributing
- Links to resources
- Contact information

## UI Components

### NEPCard

**Purpose:** Card component displaying a summary of a NEP.

**Props:**
- `nep`: Object containing NEP data
- `onClick`: Function to handle click event

**Features:**
- NEP number and title
- Author and creation date
- Status indicator
- Type badge

### NEPTable

**Purpose:** Table component displaying a list of NEPs.

**Props:**
- `neps`: Array of NEP objects
- `onSort`: Function to handle sorting
- `onFilter`: Function to handle filtering

**Features:**
- Sortable columns
- Filterable rows
- Status indicators
- Pagination

### WorkingNEPCard

**Purpose:** Card component displaying a summary of a working NEP (PR).

**Props:**
- `pr`: Object containing PR data
- `onClick`: Function to handle click event

**Features:**
- PR number and title
- Author and creation date
- Waiting time indicator
- Status badge

### CommentSection

**Purpose:** Section displaying comments for a NEP or PR.

**Props:**
- `nepId`: ID of the NEP or PR
- `comments`: Array of comment objects
- `onAddComment`: Function to handle adding a comment

**Features:**
- List of comments
- Comment form for adding new comments
- Reply functionality
- Comment sorting

### CommentForm

**Purpose:** Form for adding a new comment.

**Props:**
- `nepId`: ID of the NEP or PR
- `onSubmit`: Function to handle form submission
- `parentId`: Optional ID of the parent comment for replies

**Features:**
- Text area for comment content
- Submit button
- Authentication check
- Markdown support

### SearchBar

**Purpose:** Search input for finding NEPs.

**Props:**
- `onSearch`: Function to handle search
- `placeholder`: Placeholder text

**Features:**
- Text input
- Search button
- Autocomplete suggestions
- Search history

### StatusBadge

**Purpose:** Badge displaying the status of a NEP.

**Props:**
- `status`: Status string (e.g., "Active", "Final", "Accepted")

**Features:**
- Color-coded based on status
- Tooltip with explanation
- Accessible design

### WaitingTimeIndicator

**Purpose:** Component displaying how long a PR has been waiting.

**Props:**
- `createdAt`: Date when the PR was created

**Features:**
- Visual indicator (progress bar or timer)
- Text displaying the waiting time in a human-readable format
- Color-coded based on waiting time (e.g., green for new, red for long-waiting)

### AuthButtons

**Purpose:** Buttons for authentication actions.

**Props:**
- `isAuthenticated`: Boolean indicating if the user is authenticated
- `onLogin`: Function to handle login
- `onLogout`: Function to handle logout

**Features:**
- Login button
- Logout button
- User profile dropdown when authenticated

### UserAvatar

**Purpose:** Component displaying a user's avatar.

**Props:**
- `user`: User object with avatar URL
- `size`: Size of the avatar

**Features:**
- Circular avatar image
- Fallback to initials if no avatar is available
- Link to user profile

## Form Components

### FilterForm

**Purpose:** Form for filtering NEPs.

**Props:**
- `onFilter`: Function to handle filtering
- `filters`: Object containing current filter values

**Features:**
- Filter by status
- Filter by type
- Filter by author
- Filter by date range

### SortControls

**Purpose:** Controls for sorting NEPs.

**Props:**
- `onSort`: Function to handle sorting
- `sortField`: Current sort field
- `sortDirection`: Current sort direction

**Features:**
- Sort by number
- Sort by title
- Sort by date
- Sort by status
- Toggle sort direction

## Utility Components

### MediaWikiRenderer

**Purpose:** Component for rendering MediaWiki content as HTML.

**Props:**
- `content`: MediaWiki content string

**Features:**
- Converts MediaWiki syntax to HTML
- Handles special MediaWiki elements
- Preserves formatting and links

### LoadingSpinner

**Purpose:** Component displayed during loading states.

**Props:**
- `size`: Size of the spinner
- `color`: Color of the spinner

**Features:**
- Animated spinner
- Optional loading text
- Accessible design

### ErrorMessage

**Purpose:** Component for displaying error messages.

**Props:**
- `message`: Error message string
- `onRetry`: Optional function to handle retry

**Features:**
- Error icon
- Error message
- Retry button if provided

### Pagination

**Purpose:** Component for paginating lists.

**Props:**
- `currentPage`: Current page number
- `totalPages`: Total number of pages
- `onPageChange`: Function to handle page change

**Features:**
- Page numbers
- Previous/Next buttons
- First/Last buttons
- Page size selector