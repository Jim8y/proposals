import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

/**
 * CommentForm component provides a form for users to add new comments.
 * 
 * @param {Object} props
 * @param {Function} props.onSubmit - Callback function to handle form submission
 */
const CommentForm = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth0();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate content
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Call the onSubmit callback with the comment content
      const success = await onSubmit(content);
      
      if (success) {
        // Reset form on successful submission
        setContent('');
      } else {
        setError('Failed to add comment. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-start space-x-3">
        {/* User avatar */}
        <div className="flex-shrink-0">
          <img
            src={user?.picture || 'https://via.placeholder.com/40'}
            alt={`${user?.name || 'User'}'s avatar`}
            className="h-10 w-10 rounded-full"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/40?text=User';
            }}
          />
        </div>
        
        {/* Comment input */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <textarea
              id="comment"
              name="comment"
              rows="3"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              placeholder="Add a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          
          {/* Error message */}
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
          
          {/* Submit button */}
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
