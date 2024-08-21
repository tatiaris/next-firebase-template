import { createContext, useEffect, useState } from 'react';

interface ThemeContextType {
  setTheme: (newTheme?: string | null) => void;
}

export const ThemeContext = createContext<ThemeContextType>({ setTheme: () => {} });
