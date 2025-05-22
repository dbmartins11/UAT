// components/LanguageContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translate as rawTranslate } from '../utils/languageUtils';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const loadLanguage = async () => {
      const lang = await AsyncStorage.getItem('appLanguage');
      if (lang) setLanguage(lang);
    };
    loadLanguage();
  }, []);

  const changeLanguage = async (lang) => {
    await AsyncStorage.setItem('appLanguage', lang);
    setLanguage(lang);
  };

  const translate = (key) => rawTranslate(key, language);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
