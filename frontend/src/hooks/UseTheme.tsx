import React, { createContext, useContext, useState } from "react";

/**
 * The theme context
 * @constant ThemeContext
 */
const ThemeContext = createContext<ThemeContextType>({
  theme: "",
  setTheme: () => {},
});

/**
 * The Theme provider
 * @name ThemeProvider
 * @param {object} props Props to pass down
 * @returns The theme provider with rendered children
 */
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<string>(
    window.localStorage.getItem(import.meta.env.VITE_THEME_NAME) || "light"
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook allowing access to theme context in another component
 * @name UseTheme
 * @returns the theme context
 */
const UseTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("UseTheme must be used in a ThemeProvider");
  }
  return context;
};

/**
 * Types
 */
type ThemeContextType = {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
};

/**
 * Exports
 */
export { ThemeContext, ThemeProvider, UseTheme };
export default UseTheme;
