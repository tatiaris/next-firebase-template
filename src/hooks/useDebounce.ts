import { useEffect, useState } from "react";

type UseDebounceReturn<T> = [boolean, T];

function useDebounce<T>(
  searchFunction: (query: string) => Promise<T>,
  searchQuery: string,
  cleanup: (t: T) => T = (t) => t,
  delay: number = 500,
  initialData: T = {} as T,
): UseDebounceReturn<T> {
  const [debounced, setDebounced] = useState<T>(initialData);
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    if (searchQuery === "") {
      setDebounced(initialData);
      setInProgress(false);
      return;
    }

    setInProgress(true);
    const timeoutId = setTimeout(async () => {
      searchFunction(searchQuery).then((results) => {
        setDebounced(cleanup(results));
        setInProgress(false);
      }).catch(() => {
        setDebounced(initialData);
        setInProgress(false);
      });
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery, delay, searchFunction]);

  return [inProgress, debounced];
}

export default useDebounce;
