// components/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Criação do contexto
const ThemeContext = createContext();

// Hook de acesso ao contexto
export const useTheme = () => useContext(ThemeContext);

// Componente de provider
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Carrega a preferência salva (ou usa a do sistema por defeito)
  useEffect(() => {
    const loadTheme = async () => {
      const saved = await AsyncStorage.getItem('darkMode');
      if (saved !== null) {
        setDarkMode(saved === 'true');
      } else {
        const system = Appearance.getColorScheme();
        setDarkMode(system === 'dark');
      }
    };

    loadTheme();
  }, []);

  // Atualiza e salva a preferência
  const toggleTheme = async () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    await AsyncStorage.setItem('darkMode', newValue.toString());
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
