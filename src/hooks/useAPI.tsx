import { useCallback, createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./useAuth";
import { addObjectToCollection, deleteDocById, getCollectionWithIds, updateObjectById } from "@lib/firebase";
import { Collections } from "@lib/constants";
import { Note } from "@components/forms/note/metadata";

type APIMethods = {
  isLoading: boolean;
  fetchNotes: () => Promise<Note[]>;
  addNote: (note: Partial<Note>) => Promise<Note>;
  updateNote: (note: Partial<Note> & { id: string }) => Promise<void>;
  deleteNote: (note: Note) => Promise<string>;
  queryNotes: (query: string) => Promise<Note[]>;
};

const APIContext = createContext<APIMethods | undefined>(undefined);

export function APIProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [authHeader, setAuthHeader] = useState<RequestInit>({});

  useEffect(() => {
    const setupAuthHeader = async () => {
      const token = auth.user ? await auth.user.getIdToken() : null;
      setAuthHeader(token ? { headers: { Authorization: `Bearer ${token}` } } : {});
      setIsLoading(false);
    };
    setupAuthHeader();
  }, [auth.user]);

  const get = useCallback(
    (url: string, options: RequestInit = {}) => fetch(url, { ...authHeader, ...options }).then(res => res.json()),
    [authHeader]
  );

  const apiMethods: APIMethods = {
    isLoading,
    fetchNotes: () => getCollectionWithIds(Collections.Note),
    addNote: (note) => addObjectToCollection(Collections.Note, note),
    updateNote: (note) => updateObjectById(Collections.Note, note.id, note),
    deleteNote: (note) => deleteDocById(Collections.Note, note.id),
    queryNotes: (query) => get(`/api/notes?q=${query}`)
  };

  return <APIContext.Provider value={apiMethods}>{children}</APIContext.Provider>;
}

export default function useAPI() {
  const context = useContext(APIContext);
  if (!context) throw new Error("useAPI must be used within an APIProvider");
  return context;
}
