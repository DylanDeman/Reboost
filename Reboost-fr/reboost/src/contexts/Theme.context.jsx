import { createContext, useState, useCallback, useMemo, useEffect } from 'react';

export const themes = {
  light: 'light',
  dark: 'dark',
};

const switchTheme = (theme) => (theme === themes.dark ? themes.light : themes.dark);

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Get the saved theme from sessionStorage, fallback to 'dark' if not found
  const savedTheme = sessionStorage.getItem('themeMode');
  const initialTheme = savedTheme && Object.values(themes).includes(savedTheme)
    ? savedTheme
    : themes.dark;

  const [theme, setTheme] = useState(initialTheme);

  const toggleTheme = useCallback(() => {
    const newThemeValue = switchTheme(theme);
    setTheme(newThemeValue);
    sessionStorage.setItem('themeMode', newThemeValue); // Save to sessionStorage
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    textTheme: switchTheme(theme), // Text color should be opposite of the current theme
    toggleTheme,
  }), [theme, toggleTheme]);

  // Effect to update body background color
  useEffect(() => {
    document.body.className = ''; // Remove any existing theme class
    document.body.classList.add(theme); // Add the appropriate theme class
  }, [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
