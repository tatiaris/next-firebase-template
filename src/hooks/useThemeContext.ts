import { createContext } from 'react';

export const ThemeContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTheme: (theme = null) => {}
});
