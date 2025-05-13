import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSnippets } from "../services/SnippetContext";
import axiosInstance from "../services/axiosInstance";

const CommentsSection = () => {
  const { snippetId } = useParams();
  const { fetchSnippetById } = useSnippets();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const getSnippet = async () => {
      const data = await fetchSnippetById(snippetId);
      if (data) {
        setComments(data.Comments || []);
      }
    };

    getSnippet();
  }, [snippetId, fetchSnippetById]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      await axiosInstance.post(`/addComment`, {
        snippetId,
        content: newComment,
      });

      setComments((prevComments) => [
        ...prevComments,
        {
          id: Date.now(), // temporary unique ID
          content: newComment,
          User: { username: "You" },
          createdAt: new Date(),
        },
      ]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <div className="comments-section mt-6">
      <div className="mt-6 flex gap-3">
        <textarea
          className="w-full p-2 mt-3 h-17 bg-[#1a1a1d] text-white border border-gray-700 shadow-lg rounded-md"
          placeholder="Write a comment..."
          value={newComment}
          onChange={handleCommentChange}
        />
        <button
          onClick={handleCommentSubmit}
          className="mt-3 px-6 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-400"
        >
          Comment
        </button>
      </div>

      <h3 className="text-xl font-semibold text-gray-300 mt-6">Comments</h3>
      <div className="mt-4 space-y-4">
        {comments?.length === 0 ? (
          <p className="text-gray-400">No comments yet.</p>
        ) : (
          comments.map((comment, index) => (
            <div
              key={comment.id || index}
              className="comment flex space-x-4 p-4 border-b border-gray-600"
            >
              <div className="bg-red-900 w-12 h-12 rounded-full flex items-center justify-center text-3xl font-bold">
                {comment.User?.username[0]?.toUpperCase()}
              </div>
              <div className="comment-content flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-200">
                    {comment.User.username}
                  </span>
                  <span className="text-sm text-gray-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-300 mt-1">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
