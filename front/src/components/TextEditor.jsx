import React, { useCallback, useRef, useContext, useEffect } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import { useParams } from "react-router-dom";
import { useSnippets } from "../services/SnippetContext";
import { UserContext } from "../services/UserContext";
import { SocketContext } from "../services/socketContext";
import { useState } from "react";

function TextEditor({ text, onChange, isThinking, isStreaming }) {
  const { snippetId } = useParams();
  const { snippet } = useSnippets();
  const { user } = useContext(UserContext);
  const { isCollaborating, collaboratingSnippetId, socket } =
    useContext(SocketContext);

  const [showTooltip, setShowTooltip] = useState(false);
  const editorRef = useRef();
  // Adjust isOwner to handle different API response structures
  const isOwner = snippet
    ? snippet.userId === user?.id || snippet.User?.id === user?.id
    : true;

  // Log for debugging
  useEffect(() => {
    console.log(
      "TextEditor: isOwner:",
      isOwner,
      "snippet:",
      snippet,
      "user:",
      user
    );
  }, [isOwner, snippet, user]);

  const handleKeyDown = useCallback(
    (e) => {
      if (
        !isOwner &&
        !(isCollaborating && collaboratingSnippetId === snippetId)
      ) {
        e.preventDefault();
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
      }
    },
    [isOwner, isCollaborating, collaboratingSnippetId, snippetId]
  );

  const getLanguageSyntax = (language) => {
    if (!language) return Prism.languages.clike;
    const lang = language.toLowerCase();
    if (lang.includes("javascript")) return Prism.languages.javascript;
    if (lang.includes("python")) return Prism.languages.python;
    if (lang.includes("java")) return Prism.languages.java;
    if (lang.includes("c++")) return Prism.languages.cpp;
    return Prism.languages.clike;
  };

  const handleChange = useCallback(
    (newCode) => {
      onChange(newCode);
      if (isCollaborating && collaboratingSnippetId === snippetId) {
        socket.emit("codeChange", { snippetId, code: newCode });
      }
    },
    [onChange, isCollaborating, collaboratingSnippetId, snippetId, socket]
  );

  const languageSyntax = getLanguageSyntax(snippet?.language);

  return (
    <div className="relative w-full max-w-screen mx-auto">
      <div className="flex bg-[#1a1a1d] rounded-xl border border-gray-700 shadow-lg overflow-hidden">
        <Editor
          ref={editorRef}
          value={text}
          onValueChange={handleChange}
          readOnly={
            isStreaming ||
            (!isOwner &&
              !(isCollaborating && collaboratingSnippetId === snippetId))
          }
          highlight={(code) =>
            Prism.highlight(code, languageSyntax, languageSyntax)
          }
          padding={20}
          className="w-full text-lg text-white bg-[#1a1a1d] focus:outline-none font-mono resize-none"
          style={{
            minHeight: "500px",
            overflow: "auto",
          }}
          onKeyDown={handleKeyDown}
        />
        {isThinking && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-lg rounded-xl">
            <span className="bg-gray-800 px-4 py-2 rounded shadow">
              AI Assistant is thinking...
            </span>
          </div>
        )}
      </div>
      {showTooltip && (
        <div className="absolute top-3 left-3 bg-blue-600 text-white text-sm px-3 py-2 rounded shadow z-50">
          Cannot edit in read-only editor. Request collaboration to edit.
        </div>
      )}
    </div>
  );
}

export default TextEditor;
