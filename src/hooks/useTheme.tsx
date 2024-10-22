import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

export const ThemeContext = createContext<{
  theme: string;
  setTheme: Dispatch<SetStateAction<string>>;
  toggleTheme: () => void;
}>({
  theme: "light",
  setTheme: () => { },
  toggleTheme: () => { },
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    const localTheme = localStorage.getItem("theme") || "light";
    document.getElementsByTagName("html")[0].classList.add(localTheme);
    setTheme(localTheme);
  }, []);

  useEffect(() => {
    const oldTheme = theme === "light" ? "dark" : "light";
    document.getElementsByTagName("html")[0].classList.remove(oldTheme);
    document.getElementsByTagName("html")[0].classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <ThemeContext.Provider value={{ theme: theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  return useContext(ThemeContext);
};
