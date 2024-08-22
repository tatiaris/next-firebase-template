import { useEffect, useState } from 'react';

const useDebounce = (searchFunction, searchQuery, delay) => {
  const [debounced, setDebounced] = useState(null);
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    if (searchQuery === '') {
      setDebounced(null);
      setInProgress(false);
      return;
    }

    setInProgress(true);
    const timeoutId = setTimeout(async () => {
      const results = await searchFunction(searchQuery);
      setDebounced(results);
      setInProgress(false);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery, delay, searchFunction]);

  return [inProgress, debounced];
};

export default useDebounce;
