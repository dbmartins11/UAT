// app/(tabs)/settings.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsPage() {
  const { darkMode, toggleTheme } = useTheme();
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;

  const [language, setLanguage] = useState('en');

  const handleLanguageChange = () => {
    setLanguage(prev => (prev === 'en' ? 'pt' : 'en'));
    // Aqui podes guardar em AsyncStorage ou contexto
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#111' : '#fff' }]}>
      <Text style={[styles.title, { color: darkMode ? '#fff' : '#000' }]}>⚙️ Settings</Text>

      {/* Tema Escuro */}
      <View style={styles.row}>
        <Text style={[styles.label, { color: darkMode ? '#ccc' : '#333' }]}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={toggleTheme} />
      </View>

      {/* Idioma */}
      <TouchableOpacity style={styles.row} onPress={handleLanguageChange}>
        <Text style={[styles.label, { color: darkMode ? '#ccc' : '#333' }]}>Language</Text>
        <Text style={[styles.value, { color: darkMode ? '#ccc' : '#000' }]}>
          {language === 'en' ? 'English' : 'Português'}
        </Text>
        <Ionicons name="chevron-forward" size={20} color={darkMode ? '#ccc' : '#333'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    marginHorizontal: 10,
  },
});
