// components/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';

// Create context
const ThemeContext = createContext();

// Hook to use the theme
export const useTheme = () => useContext(ThemeContext);

// Provider component
export const ThemeProvider = ({ children }) => {
  const colorScheme = Appearance.getColorScheme(); // 'light' or 'dark'
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');

  const toggleTheme = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setDarkMode(colorScheme === 'dark');
    });

    return () => listener.remove();
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
