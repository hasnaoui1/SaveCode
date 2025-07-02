import React, { useState, useEffect, useContext } from "react";
import {
  ThumbsUp,
  BarChart2,
  Globe,
  Copy,
  LinkIcon,
  PlayCircle,
  MessageCircle,
} from "lucide-react";
import axiosInstance from "../services/axiosInstance";
import { useParams } from "react-router-dom";

import { useSnippets } from "../services/SnippetContext";
import { UserContext } from "../services/UserContext";
import { SocketContext } from "../services/socketContext";

export default function EngagementBar({
  initialLikes = 0,
  initialViews = 0,
  onCollab = () => {},
  onCopyCode = () => {},
  onCopyLink = () => {},
  onRun = () => {},
  onAIPrompt = () => {},
  snippetOwnerId,
}) {
  const { snippet } = useSnippets();
  const { user } = useContext(UserContext);
  const { sendCollabRequest } = useContext(SocketContext);

  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAIPrompt] = useState("");
  const { snippetId } = useParams();

  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    setLikes((prev) => prev + 1);
    await axiosInstance.post(`/addFavorite`, { snippetId });
  };
  const handleCopyLink = () => {
    const link = `${window.location.origin}/create/${snippetId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
  alert("Link copied to clipboard!"); // Simple
})
      .catch((err) => {
        console.error("Failed to copy link:", err);
      });
  };

  const handleCollabClick = () => {
    sendCollabRequest(snippetOwnerId, snippetId);
  };

  const handleAIPromptSubmit = () => {
    if (aiPrompt.trim()) {
      onAIPrompt(aiPrompt);
      setAIPrompt("");
      setShowAIPrompt(false);
    }
  };

  return (
    <div className="flex items-center justify-between w-full px-1 mt-4 text-gray-300 text-lg font-medium">
      <div className="flex items-center space-x-6">
        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={handleLike}
          disabled={liked}
        >
          <ThumbsUp
            className={`h-6 w-6 ${liked ? "text-blue-500" : "text-gray-400"}`}
          />
          <span>{likes}</span>
        </button>
        <div className="flex items-center space-x-2 hover:text-white">
          <BarChart2 className="h-6 w-6 text-gray-400" />
          <span>{initialViews}</span>
        </div>
      </div>

      <div className="flex items-center space-x-5">
        {snippet?.userId === user?.id ? (
          <button
            onClick={onRun}
            className="flex items-center space-x-2 text-white hover:text-blue-400"
          >
            <PlayCircle className="h-6 w-6" />
            <span>Run</span>
          </button>
        ) : (
          <></>
        )}

        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={handleCollabClick}
        >
          <Globe className="h-6 w-6 text-gray-400" />
          <span className="hidden sm:inline">collab</span>
        </button>

        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={onCopyCode}
        >
          <Copy className="h-6 w-6 text-gray-400" />
          <span className="hidden sm:inline">Copy Code</span>
        </button>

        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={handleCopyLink}
        >
          <LinkIcon className="h-6 w-6 text-gray-400" />
          <span className="hidden sm:inline">Copy Link</span>
        </button>

        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => setShowAIPrompt(true)}
        >
          <MessageCircle className="h-6 w-6 text-gray-400" />
          <span className="hidden sm:inline">AI Assistant</span>
        </button>
      </div>

      {showAIPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1d] p-6 rounded-lg w-full max-w-md">
            <h3 className="text-white text-lg mb-4">AI Assistant Prompt</h3>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAIPrompt(e.target.value)}
              placeholder="Enter your AI prompt (e.g., 'Generate a Python function...')"
              className="w-full h-24 p-2 bg-[#2a2a2e] text-white rounded focus:outline-none"
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setShowAIPrompt(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAIPromptSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
