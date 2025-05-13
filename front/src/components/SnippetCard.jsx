import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const SnippetCard = ({ snippet }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(`/create/${snippet.id}`);
      }}
      className="bg-[#1e1e1e] p-6 rounded-2xl shadow-lg border border-gray-700"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-2xl font-bold text-white">
          {snippet.title || "Untitled"}
        </h3>
        <div className="text-gray-400 text-2xl cursor-pointer">⋮</div>
      </div>

      <div className="text-base text-gray-300 flex items-center gap-3 mb-2">
        <span>📅 {format(new Date(snippet.createdAt), "MMM dd, yyyy")}</span>
        <span>• 👤 {snippet.owner}</span>
      </div>

      <div className="text-base text-gray-400 mb-4">
        {snippet.favoritesCount ?? 0} likes • 0 views
      </div>

      <span className="text-sm bg-blue-800 px-3 py-1 rounded-full text-white font-medium mb-3 inline-block">
        {snippet.language}
      </span>

      {/* Code Preview */}
      <pre className="mt-4 bg-[#0e0e10] text-md p-4 rounded-md text-gray-100 max-h-40 overflow-hidden whitespace-pre-wrap leading-relaxed">
        {snippet.code?.slice(0, 300)}
      </pre>
    </div>
  );
};

export default SnippetCard;
