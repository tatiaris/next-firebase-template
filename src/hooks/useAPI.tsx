import { useCallback, createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { addObjectToCollection, deleteDocById, getCollectionWithIds, updateObjectById } from "@lib/firebase";
import { Collections } from "@lib/constants";
import { Note } from "@components/forms/note/metadata";

export const APIContext = createContext<{
  isLoading: boolean;
  generateRandomNote: () => Promise<string>;
  fetchNotes: () => Promise<Note[]>;
  addNote: (note: Partial<Note>) => Promise<Note>;
  updateNote: (note: Partial<Note>) => Promise<void>;
  deleteNote: (note: Note) => Promise<string>;
} | null>(null);

export function APIProvider({ children }) {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [authHeader, setAuthHeader] = useState<RequestInit>({});

  useEffect(() => {
    if (auth.user) {
      auth.user.getIdToken().then((token) => {
        setAuthHeader({
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsLoading(false);
      });
    } else {
      setAuthHeader({});
      setIsLoading(false);
    }
  }, [auth.user]);

  const get = useCallback((url: string, options: RequestInit = {}) =>
    fetch(url, { ...authHeader, ...options }).then((res) => res.json()), [authHeader]);

  const generateRandomNote = (): Promise<string> => get('/openai');

  const fetchNotes = (): Promise<Note[]> => getCollectionWithIds(Collections.Note);
  const addNote = (note: Partial<Note>): Promise<Note> => addObjectToCollection(Collections.Note, note);
  const updateNote = (note: Partial<Note> & { id: string }): Promise<void> => updateObjectById(Collections.Note, note.id, note);
  const deleteNote = (note: Note): Promise<string> => deleteDocById(Collections.Note, note.id);

  return (
    <APIContext.Provider value={{
      isLoading,
      generateRandomNote,
      fetchNotes,
      addNote,
      updateNote,
      deleteNote,
    }}>
      {children}
    </APIContext.Provider>
  );
}

export default function useAPI() {
  return useContext(APIContext);
}
