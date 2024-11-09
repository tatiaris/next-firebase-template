import { useCallback, createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./useAuth";
import { addObjectToCollection, deleteDocById, deleteFile, getCollectionWithIds, updateObjectById, uploadFile, UploadFileResponse } from "@lib/firebase";
import { Collections } from "@lib/constants";
import { Note } from "@components/forms/note/metadata";

export type APIMethods = {
  isLoading: boolean;
  fetchNotes: () => Promise<Note[]>;
  addNote: (note: Partial<Note>) => Promise<Note>;
  updateNote: (note: Partial<Note> & { id: string }) => Promise<Partial<Note>>;
  deleteNote: (note: Note) => Promise<string>;
  queryNotes: (query: string) => Promise<Note[]>;
  uploadFile: (file: File, path: string, replace?: boolean) => Promise<UploadFileResponse>;
  deleteFile: (path: string) => Promise<{ success: boolean; message: string, error?: any }>;
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
    queryNotes: (query) => get(`/api/notes?q=${query}`),
    uploadFile: (file: File, path: string, replace = false) => uploadFile(file, path, replace),
    deleteFile: (path: string) => deleteFile(path),
  };

  return <APIContext.Provider value={apiMethods}>{children}</APIContext.Provider>;
}

export default function useAPI() {
  const context = useContext(APIContext);
  if (!context) throw new Error("useAPI must be used within an APIProvider");
  return context;
}
