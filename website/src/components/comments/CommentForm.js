import React, { useState } from 'react';

/**
 * CommentForm component provides a form for users to add new comments without requiring login.
 * 
 * @param {Object} props
 * @param {Function} props.onAddComment - Callback function to handle form submission
 */
const CommentForm = ({ onAddComment }) => {
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
      
      // Call the onAddComment callback with the comment content and author name
      await onAddComment(content, authorName);
      
      // Reset form on successful submission
      setContent('');
      setError(null);
    } catch (err) {
      console.error('Error submitting comment:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium mb-3">Add a Comment</h3>
      
      {/* Author name input */}
      <div className="mb-3">
        <label htmlFor="author-name" className="block text-sm font-medium text-gray-700 mb-1">
          Your Name (optional)
        </label>
        <input
          type="text"
          id="author-name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          placeholder="Enter your name"
        />
      </div>
      
      {/* Comment content textarea */}
      <div className="mb-3">
        <label htmlFor="comment-content" className="block text-sm font-medium text-gray-700 mb-1">
          Comment
        </label>
        <textarea
          id="comment-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          placeholder="Write your comment here..."
          required
        />
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-3 text-red-500 text-sm">
          {error}
        </div>
      )}
      
      {/* Submit button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Comment'}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
