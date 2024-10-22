import { createContext, useContext, useState } from "react";

export const CacheContext = createContext<ReturnType<typeof useCache>>({
  cache: {},
  setCache: () => {},
  updateCache: () => {},
});

export const CacheProvider = ({ children }) => {
  const [cache, setCache] = useState({} as Record<string, any>);

  const updateCache = (key: string, value: any) => {
    setCache({ ...cache, [key]: value });
  };

  return (
    <CacheContext.Provider value={{ cache, setCache, updateCache }}>
      {children}
    </CacheContext.Provider>
  );
};

export function useCache() {
  return useContext(CacheContext);
}
