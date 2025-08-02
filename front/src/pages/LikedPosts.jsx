import React, { useContext } from 'react';
import { useSnippets } from '../services/SnippetContext';
import { UserContext } from '../services/UserContext';
import SnippetCard from '../components/SnippetCard';

const LikedPosts = () => {
  const { snippets } = useSnippets();
  const { user } = useContext(UserContext);

  const likedSnippets = snippets.filter((s) =>
    s?.Favorites?.some((f) => f.userId === user?.id)
  );

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-2 gap-4">
        {likedSnippets.map((snippet, index) => (
          <SnippetCard key={index} snippet={snippet} />
        ))}
      </div>
    </div>
  );
};

export default LikedPosts;
