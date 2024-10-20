import { createContext, useContext, useEffect, useState } from 'react';

export const ThemeContext = createContext<{
  theme: string;
  setTheme: (theme: string | null) => void;
}>({
  theme: 'light',
  setTheme: () => {}
});

export function ThemeProvider({ children }) {
  const [themeState, setThemeState] = useState<string>('light');

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    document.getElementsByTagName('html')[0].classList.add(theme);
    localStorage.setItem('theme', theme);
    setThemeState(theme);
  }, []);

  function setTheme(newTheme: string | null = null) {
    const theme = localStorage.getItem('theme');
    const updatedTheme = newTheme || (theme === 'light' ? 'dark' : 'light');
    document.getElementsByTagName('html')[0].classList.remove(theme);
    document.getElementsByTagName('html')[0].classList.add(updatedTheme);
    localStorage.setItem('theme', updatedTheme);
    setThemeState(updatedTheme);
  }

  return <ThemeContext.Provider value={{ theme: themeState, setTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  return useContext(ThemeContext);
};
