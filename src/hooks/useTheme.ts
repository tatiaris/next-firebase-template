import { createContext, useEffect, useState } from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: (newTheme?: string | null) => void;
  updateTheme: (newTheme?: string | null) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  updateTheme: () => {}
});

export const useTheme = () => {
  const [theme, setTheme] = useState('light');

  function updateTheme(newTheme = null) {
    const theme = localStorage.getItem('theme');
    if (newTheme) {
      document.body.classList.remove(theme);
      document.body.classList.add(newTheme);
      localStorage.setItem('theme', newTheme);
    } else {
      document.body.classList.remove(theme);
      document.body.classList.add(theme === 'light' ? 'dark' : 'light');
      localStorage.setItem('theme', theme === 'light' ? 'dark' : 'light');
    }
  }

  return { theme, setTheme, updateTheme };
};
