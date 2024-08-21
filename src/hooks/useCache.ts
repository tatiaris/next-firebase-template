import { createContext, useState } from 'react';

export const CacheContext = createContext<ReturnType<typeof useCache>>({
  cache: {},
  setCache: () => {},
  updateCache: () => {}
});

export const useCache = () => {
  const [cache, setCache] = useState({} as Record<string, any>);

  const updateCache = (key: string, value: any) => {
    setCache({ ...cache, [key]: value });
  };

  return { cache, setCache, updateCache };
};
