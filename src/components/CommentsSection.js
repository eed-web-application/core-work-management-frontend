import React, { useState } from "react";
// import "./CommentsSection.css";

const CommentsSection = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState("");

  const handleInputChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment, index) => (
            <li key={index} className="comment-item">
              <span className="comment-author">{comment.author}</span>
              <p className="comment-text">{comment.text}</p>
              <span className="comment-date">{comment.date}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet.</p>
      )}
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={handleInputChange}
          placeholder="Add a comment..."
          className="comment-input"
        />
        <button type="submit" className="comment-submit">Post Comment</button>
      </form>
    </div>
  );
};

export default CommentsSection;
