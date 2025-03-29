# Neo N3 Proposals Website API Documentation

This document outlines the API endpoints for the Neo N3 Proposals website, both for the Netlify Functions backend and the external APIs we interact with.

## GitHub API Integration

### Fetch NEP Content

**Endpoint:** `GET https://api.github.com/repos/neo-project/proposals/contents/nep-{number}.mediawiki`

**Description:** Fetches the content of a specific NEP file from the GitHub repository.

**Parameters:**
- `number`: The NEP number

**Response:**
```json
{
  "name": "nep-1.mediawiki",
  "path": "nep-1.mediawiki",
  "sha": "abc123...",
  "size": 12345,
  "url": "https://api.github.com/repos/neo-project/proposals/contents/nep-1.mediawiki",
  "html_url": "https://github.com/neo-project/proposals/blob/master/nep-1.mediawiki",
  "git_url": "https://api.github.com/repos/neo-project/proposals/git/blobs/abc123...",
  "download_url": "https://raw.githubusercontent.com/neo-project/proposals/master/nep-1.mediawiki",
  "type": "file",
  "content": "base64-encoded-content",
  "encoding": "base64",
  "_links": {
    "self": "https://api.github.com/repos/neo-project/proposals/contents/nep-1.mediawiki",
    "git": "https://api.github.com/repos/neo-project/proposals/git/blobs/abc123...",
    "html": "https://github.com/neo-project/proposals/blob/master/nep-1.mediawiki"
  }
}
```

### Fetch All NEPs

**Endpoint:** `GET https://api.github.com/repos/neo-project/proposals/contents/`

**Description:** Fetches all files in the repository root to identify NEP files.

**Response:** Array of file objects similar to the above.

### Fetch Working NEPs (Pull Requests)

**Endpoint:** `GET https://api.github.com/repos/neo-project/proposals/pulls?state=open`

**Description:** Fetches all open pull requests, which represent working NEPs.

**Parameters:**
- `state`: The state of the pull requests to fetch (open, closed, all)

**Response:**
```json
[
  {
    "url": "https://api.github.com/repos/neo-project/proposals/pulls/123",
    "id": 123456789,
    "node_id": "PR_abc123",
    "html_url": "https://github.com/neo-project/proposals/pull/123",
    "diff_url": "https://github.com/neo-project/proposals/pull/123.diff",
    "patch_url": "https://github.com/neo-project/proposals/pull/123.patch",
    "issue_url": "https://api.github.com/repos/neo-project/proposals/issues/123",
    "number": 123,
    "state": "open",
    "locked": false,
    "title": "NEP-X: New Feature Proposal",
    "user": {
      "login": "username",
      "id": 12345,
      "avatar_url": "https://avatars.githubusercontent.com/u/12345",
      "url": "https://api.github.com/users/username"
    },
    "body": "This PR proposes a new feature...",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-02T00:00:00Z",
    "closed_at": null,
    "merged_at": null
  }
]
```

## Netlify Functions API

### Get NEPs

**Endpoint:** `GET /.netlify/functions/get-neps`

**Description:** Fetches all NEPs from the GitHub repository, parses their metadata, and returns them in a structured format.

**Response:**
```json
{
  "neps": [
    {
      "number": 1,
      "title": "NEP Purpose and Guidelines",
      "author": "Erik Zhang",
      "type": "Meta",
      "status": "Active",
      "created": "2017-8-3",
      "url": "https://github.com/neo-project/proposals/blob/master/nep-1.mediawiki"
    }
  ]
}
```

### Get NEP Content

**Endpoint:** `GET /.netlify/functions/get-nep-content?number={number}`

**Description:** Fetches the content of a specific NEP, converts it from MediaWiki format to HTML, and returns it.

**Parameters:**
- `number`: The NEP number

**Response:**
```json
{
  "number": 1,
  "title": "NEP Purpose and Guidelines",
  "author": "Erik Zhang",
  "type": "Meta",
  "status": "Active",
  "created": "2017-8-3",
  "content": "<html>Converted content...</html>",
  "raw_content": "Original MediaWiki content"
}
```

### Get Working NEPs

**Endpoint:** `GET /.netlify/functions/get-working-neps`

**Description:** Fetches all open pull requests from the GitHub repository and returns them as working NEPs with waiting time.

**Response:**
```json
{
  "working_neps": [
    {
      "number": 123,
      "title": "NEP-X: New Feature Proposal",
      "author": "username",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-02T00:00:00Z",
      "waiting_time": "30 days",
      "waiting_time_ms": 2592000000,
      "url": "https://github.com/neo-project/proposals/pull/123"
    }
  ]
}
```

### Get Comments

**Endpoint:** `GET /.netlify/functions/get-comments?nep_id={nep_id}`

**Description:** Fetches all comments for a specific NEP or PR.

**Parameters:**
- `nep_id`: The NEP number or PR number prefixed with "pr-" (e.g., "1" or "pr-123")

**Response:**
```json
{
  "comments": [
    {
      "id": "comment-123",
      "nep_id": "1",
      "user": {
        "id": "user-123",
        "name": "John Doe",
        "avatar_url": "https://example.com/avatar.jpg"
      },
      "content": "This is a great proposal!",
      "created_at": "2023-01-01T00:00:00Z",
      "parent_id": null
    }
  ]
}
```

### Create Comment

**Endpoint:** `POST /.netlify/functions/create-comment`

**Description:** Creates a new comment for a specific NEP or PR.

**Request Body:**
```json
{
  "nep_id": "1",
  "content": "This is a great proposal!",
  "parent_id": null
}
```

**Response:**
```json
{
  "id": "comment-123",
  "nep_id": "1",
  "user": {
    "id": "user-123",
    "name": "John Doe",
    "avatar_url": "https://example.com/avatar.jpg"
  },
  "content": "This is a great proposal!",
  "created_at": "2023-01-01T00:00:00Z",
  "parent_id": null
}
```

## Authentication API

### Login

**Endpoint:** `GET /.netlify/functions/auth`

**Description:** Initiates the Auth0 authentication flow.

### Callback

**Endpoint:** `GET /.netlify/functions/auth-callback`

**Description:** Handles the Auth0 authentication callback and sets up the user session.

### Logout

**Endpoint:** `GET /.netlify/functions/auth-logout`

**Description:** Logs the user out and clears the session.

### Get User

**Endpoint:** `GET /.netlify/functions/auth-user`

**Description:** Returns the currently authenticated user's information.

**Response:**
```json
{
  "id": "user-123",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar_url": "https://example.com/avatar.jpg"
}
```