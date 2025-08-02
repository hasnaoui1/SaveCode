import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import axiosInstance from "./axiosInstance";

export const SnippetContext = createContext();

export const SnippetProvider = ({ children }) => {
  const [snippets, setSnippets] = useState([]);
  const [snippet, setSnippet] = useState(null);

  useEffect(() => {

    console.log("Fetching all snippets from /getAllS");
    fetchSnippets()
  }, []);

  const fetchSnippets = ()=>{
      axiosInstance
      .get("/getAllS")
      .then((data) => {
        console.log("Snippets fetched:", data);
        setSnippets(data);
      })
      .catch((err) =>
        console.error("Error fetching all snippets:", err.message)
      );
  }
  const fetchSnippetById = useCallback(async (id) => {
    try {
      if (id) {
        console.log(`Fetching snippet with id: ${id}`);
        const data = await axiosInstance.get(`/getSById/${id}`);
        console.log("Snippet fetched:", data);
        setSnippet((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(data)) {
            return data;
          }
          return prev;
        });
        return data;
      }
    } catch (err) {
      console.error(`Error fetching snippet by ID ${id}:`, err.message);
    }
  }, []);

  const resetSnippet = useCallback(() => {
    console.log("Resetting snippet state");
    setSnippet(null);
  }, []);

  const deleteSnippet= (id)=>{
    axiosInstance.delete(`/deleteS/${id}`)
    .then(data=>{console.log(data) 
      fetchSnippets()

    })
    .catch(err=>console.log(err.message))

  }

  const contextValue = useMemo(
    () => ({ snippets, setSnippets, snippet, fetchSnippetById, resetSnippet, deleteSnippet }),
    [snippets, snippet, fetchSnippetById, resetSnippet]
  );

  return (
    <SnippetContext.Provider value={contextValue}>
      {children}
    </SnippetContext.Provider>
  );
};

export const useSnippets = () => useContext(SnippetContext);
