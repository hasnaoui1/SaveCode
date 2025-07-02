import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SnippetCard from "../components/SnippetCard";
import axiosInstance from "../services/axiosInstance";

const Searchx = () => {
  const { title } = useParams();
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  const languages = [
    "all",
    ...new Set(snippets.map((s) => s.language).filter(Boolean)),
  ];

  useEffect(() => {
    const fetchSnippets = async () => {
      if (!title || title.trim() === "") {
        setSnippets([]);
        return;
      }
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/search/${title}`);
        setSnippets(res); // Correct: use res.data if needed
        console.log("Snippets fetched:", res);
      } catch (err) {
        console.error("Error fetching snippets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, [title]);

  // Filter snippets based on selected language
  const filteredSnippets =
    selectedLanguage === "all"
      ? snippets
      : snippets.filter((s) => s.language === selectedLanguage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">
          Search Results for "{title}"
        </h1>

        <div>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-[#2a2a2a] text-gray-300 px-3 py-1 rounded-md border border-[#333]"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang === "all" ? "All Languages" : lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSnippets.length > 0 ? (
            filteredSnippets.map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))
          ) : (
            <p className="text-gray-400">No snippets found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Searchx;
