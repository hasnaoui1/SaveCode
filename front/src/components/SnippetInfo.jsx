import { Pencil, Eye } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useSnippets } from "../services/SnippetContext";
import { UserContext } from "../services/UserContext";
import axiosInstance from "../services/axiosInstance";

function SnippetInfo() {
  const { snippetId } = useParams();
  const { snippet, fetchSnippetById } = useSnippets();
  const { user } = useContext(UserContext);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("Untitled");
  const [language, setLanguage] = useState("plaintext");
  const [privacy, setPrivacy] = useState("private");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (snippet && !isEditing) {
      setTitle(snippet.title || "Untitled");
      setLanguage(snippet.language || "plaintext");
      setPrivacy(snippet.isPublic ? "public" : "private");
    }
  }, [snippet, isEditing]);

  const handleSave = async () => {
    try {
      await axiosInstance.put(`/updateS/${snippetId}`, {
        title,
        language,
        isPublic: privacy === "public",
      });

      // Update the context with the new snippet data
      await fetchSnippetById(snippetId);

      // Close modal after successful save
      setShowModal(false);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating snippet:", err);
    }
  };

  if (!snippet) {
    return <div>Loading snippet...</div>;
  }

  return (
    <div className="w-full text-white mb-2 px-3">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <span>{title}</span>
          {snippet.userId === user?.id ? (
            <Pencil
              size={18}
              className="text-gray-400 cursor-pointer"
              onClick={() => {
                setIsEditing(true);
                setShowModal(true);
              }}
            />
          ) : (
            <></>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
          <Eye size={16} />
          <span>
            {snippet.createdAt
              ? new Date(snippet.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Loading..."}
          </span>
          <span className="mx-1">•</span>
          <span className="text-white">
            {snippet ? snippet.User.username : "loading"}
          </span>
        </div>
      </div>

      <div className="mt-2">
        <span className="text-xs bg-[#172b3a] text-blue-300 px-2 py-1 rounded-full font-medium">
          {language}
        </span>
      </div>

      
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-700">
            <h2 className="text-lg font-semibold mb-4 text-white">Edit Post</h2>

            <label className="block mb-2 text-sm">Title</label>
            <input
              className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label className="block mb-2 text-sm">Language</label>
            <select
              className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-600 mb-4"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>plaintext</option>
              <option>C++</option>
              <option>JavaScript</option>
              <option>Python</option>
              <option>Java</option>
            </select>

            <label className="block mb-2 text-sm">Privacy</label>
            <select
              className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-600 mb-6"
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setIsEditing(false);
                }}
                className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SnippetInfo;
