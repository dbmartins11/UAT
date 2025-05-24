import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const translations = {
  en: {
    title: 'Settings',
    darkMode: 'Dark Mode',
    language: 'Language',
    english: 'English',
    portuguese: 'Portuguese',
    slovenian: 'Slovenian',
  },
  pt: {
    title: 'Definições',
    darkMode: 'Modo Escuro',
    language: 'Idioma',
    english: 'Inglês',
    portuguese: 'Português',
    slovenian: 'Esloveno',
  },
  sl: {
    title: 'Nastavitve',
    darkMode: 'Temni način',
    language: 'Jezik',
    english: 'Angleščina',
    portuguese: 'Portugalščina',
    slovenian: 'Slovenščina',
  },
};

export default function SettingsPage() {
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;
  const { darkMode, toggleTheme } = useTheme();
  const [language, setLanguage] = useState('en');

  const t = translations[language];

  const languageLabels = {
    en: t.english,
    pt: t.portuguese,
    sl: t.slovenian,
  };

  useEffect(() => {
    const loadLang = async () => {
      const lang = await AsyncStorage.getItem('appLanguage');
      if (lang) setLanguage(lang);
    };
    loadLang();
  }, []);

  const changeLanguage = async (lang) => {
    await AsyncStorage.setItem('appLanguage', lang);
    setLanguage(lang);
  };

  const backgroundColor = darkMode ? '#000' : '#fff';
  const textColor = darkMode ? '#fff' : '#000';
  const subtitleColor = darkMode ? '#aaa' : '#333';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>{t.title}</Text>

      <View style={[styles.settingRow, { borderBottomColor: darkMode ? '#333' : '#ccc', borderBottomWidth: 1, paddingBottom: 10 }]}>
        <Ionicons name="moon" size={20} color={textColor} />
        <Text style={[styles.label, { color: textColor }]}>{t.darkMode}</Text>
        <Switch value={darkMode} onValueChange={toggleTheme} />
      </View>

      <Text style={[styles.subTitle, { color: subtitleColor }]}>{t.language}</Text>

      {['en', 'pt', 'sl'].map((lang) => (
        <TouchableOpacity
          key={lang}
          onPress={() => changeLanguage(lang)}
          style={[styles.langButton, {
            backgroundColor: language === lang ? '#2894B0' : 'transparent',
            borderRadius: 6,
            paddingHorizontal: 12
          }]}
        >
          <Text style={{
            color: language === lang ? '#fff' : textColor,
            fontWeight: language === lang ? 'bold' : 'normal'
          }}>
            {languageLabels[lang]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 20,
  },
  langButton: {
    paddingVertical: 10,
    marginBottom: 8,
  },
});
