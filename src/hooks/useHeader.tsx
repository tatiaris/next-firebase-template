import { createContext, useContext, useState } from 'react';

export const HeaderContext = createContext<ReturnType<typeof useHeader>>({
  header: {
    title: '',
    description: ''
  },
  setHeader: () => {}
});

export type Headers = {
  title: string;
  description: string;
};

export const HeaderProvider = ({ children }) => {
  const [header, setHeader] = useState<Headers>({
    title: '',
    description: ''
  });

  return <HeaderContext.Provider value={{ header, setHeader }}>{children}</HeaderContext.Provider>;
};

export function useHeader() {
  return useContext(HeaderContext);
}
