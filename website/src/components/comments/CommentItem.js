import React from 'react';
import { formatDistanceToNow } from 'date-fns';

/**
 * CommentItem component displays a single comment with author information and content.
 * 
 * @param {Object} props
 * @param {Object} props.comment - The comment data to display
 * @param {string} props.comment.id - Unique identifier for the comment
 * @param {string} props.comment.content - The content of the comment
 * @param {Object} props.comment.author - Information about the comment author
 * @param {string} props.comment.author.name - Name of the author
 * @param {string} props.comment.author.picture - URL to the author's profile picture
 * @param {string} props.comment.createdAt - ISO timestamp when the comment was created
 */
const CommentItem = ({ comment }) => {
  const { content, author, createdAt } = comment;
  
  // Format the timestamp to a relative time (e.g., "2 hours ago")
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-start space-x-3">
        {/* Author avatar */}
        <div className="flex-shrink-0">
          <img
            src={author.picture || 'https://via.placeholder.com/40'}
            alt={`${author.name}'s avatar`}
            className="h-10 w-10 rounded-full"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/40?text=User';
            }}
          />
        </div>
        
        {/* Comment content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">{author.name}</h3>
            <p className="text-xs text-gray-500">{timeAgo}</p>
          </div>
          <div className="mt-1 text-sm text-gray-700 whitespace-pre-line">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
