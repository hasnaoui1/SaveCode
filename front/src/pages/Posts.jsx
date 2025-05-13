import { useSnippets } from "../services/SnippetContext";
import SnippetCard from "../components/SnippetCard";
import { UserContext } from "../services/UserContext";
import { useContext } from "react";
import { format } from "date-fns";
const Posts = () => {
  const { user } = useContext(UserContext);
  const { snippets } = useSnippets();

  return (
    <div className="flex">
      <div className="w-1/4 p-4">
        <div className="bg-red-900 w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold">
          {user?.username[0]}
        </div>
        <h2 className="mt-4 text-xl">{user?.username}</h2>
        <p className="text opacity-70">
          User Since{" "}
          {user?.createdAt
            ? format(new Date(user.createdAt), "MMM dd, yyyy")
            : "Unknown"}
        </p>

        <p className="mt-2 text-sm">📄 {user?.Snippets?.length} Posts</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {[...new Set(user?.Snippets?.map((s) => s.language))].map((lang) => (
            <span key={lang} className="bg-blue-800 text-sm px-2 py-1 rounded">
              {lang}
            </span>
          ))}
        </div>

        <button className="mt-4 w-full bg-gray-800 px-4 py-2 rounded">
          Edit Profile
        </button>
      </div>

      <div className="w-3/4 p-4">
        <div className="flex gap-4 mb-4 border-b border-gray-600">
          <button className="pb-2 border-b-2 border-white font-semibold">
            Posts
          </button>
          <button className="pb-2 text-gray-400">Likes</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {snippets
            .filter((s) => s?.userId === user?.id)
            .map((snippet, index) => (
              <SnippetCard key={index} snippet={snippet} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Posts;
