import React, { useState, useEffect } from 'react';
import { commentApi } from '../../services/api';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

/**
 * CommentList component displays all comments for a specific NEP
 * and provides a form for adding new comments without requiring authentication.
 * 
 * @param {Object} props
 * @param {string} props.nepNumber - The NEP number to display comments for
 */
const CommentList = ({ nepNumber }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch comments when the component mounts or the NEP number changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await commentApi.getComments(nepNumber);
        setComments(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [nepNumber]);

  // Handle adding a new comment
  const handleAddComment = async (commentContent, authorName) => {
    try {
      const newComment = await commentApi.addComment({
        nepNumber,
        content: commentContent,
        author: {
          name: authorName || 'Anonymous',
          picture: null
        }
      });
      
      // Add the new comment to the list
      setComments(prevComments => [...prevComments, newComment]);
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment. Please try again later.');
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments ({comments.length})</h2>
      
      {/* Comment form for adding new comments */}
      <CommentForm onAddComment={handleAddComment} />
      
      {/* List of comments */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentList;
