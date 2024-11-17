import { useCallback, createContext, useContext, useState, useEffect, ReactNode } from "react";
import useFirebase from "./useFirebase";
import { Note } from "@components/forms/note/metadata";

export type APIMethods = {
  isLoading: boolean;
  queryNotes: (query: string) => Promise<Note[]>;
};

const APIContext = createContext<APIMethods | undefined>(undefined);

export function APIProvider({ children }: { children: ReactNode }) {
  const { user } = useFirebase();
  const [isLoading, setIsLoading] = useState(true);
  const [authHeader, setAuthHeader] = useState<RequestInit>({});

  useEffect(() => {
    const setupAuthHeader = async () => {
      const token = user ? await user.getIdToken() : null;
      setAuthHeader(token ? { headers: { Authorization: `Bearer ${token}` } } : {});
      setIsLoading(false);
    };
    setupAuthHeader();
  }, [user]);

  const get = useCallback(
    (url: string, options: RequestInit = {}) => fetch(url, { ...authHeader, ...options }).then(res => res.json()),
    [authHeader]
  );

  const apiMethods: APIMethods = {
    isLoading,
    queryNotes: (query) => get(`/api/notes?q=${query}`),
  };

  return <APIContext.Provider value={apiMethods}>{children}</APIContext.Provider>;
}

export default function useAPI() {
  const context = useContext(APIContext);
  if (!context) throw new Error("useAPI must be used within an APIProvider");
  return context;
}
