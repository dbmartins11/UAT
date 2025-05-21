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
import { useTheme } from '../components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const translations = {
  en: { title: 'Settings', darkMode: 'Dark Mode', language: 'Language', english: 'English', portuguese: 'Portuguese', slovenian: 'Slovenian' },
  pt: { title: 'Definições', darkMode: 'Modo Escuro', language: 'Idioma', english: 'Inglês', portuguese: 'Português', slovenian: 'Esloveno' },
  sl: { title: 'Nastavitve', darkMode: 'Temni način', language: 'Jezik', english: 'Angleščina', portuguese: 'Portugalščina', slovenian: 'Slovenščina' },
};

export default function SettingsPage() {
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;
  const { darkMode, toggleTheme } = useTheme();
  const [language, setLanguage] = useState('en');
  const t = translations[language];

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

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#111' : '#fff' }]}>
      <Text style={[styles.title, { color: darkMode ? '#fff' : '#000' }]}>{t.title}</Text>

      <View style={styles.settingRow}>
        <Ionicons name="moon" size={20} color={darkMode ? '#fff' : '#000'} />
        <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>{t.darkMode}</Text>
        <Switch value={darkMode} onValueChange={toggleTheme} />
      </View>

      <Text style={[styles.subTitle, { color: darkMode ? '#ccc' : '#333' }]}>{t.language}</Text>
      {['en', 'pt', 'sl'].map((lang) => (
        <TouchableOpacity key={lang} onPress={() => changeLanguage(lang)} style={styles.langButton}>
          <Text style={{ color: language === lang ? '#2894B0' : darkMode ? '#fff' : '#000' }}>
            {t[lang]}
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
  },
});
