import React from 'react';
import { View, Text, Switch, Picker, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../components/ThemeContext';

const SettingsScreen = () => {
  const { t, i18n } = useTranslation();
  const { darkMode, toggleTheme } = useTheme();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('settings')}</Text>

      <View style={styles.setting}>
        <Text>{t('dark_mode')}</Text>
        <Switch value={darkMode} onValueChange={toggleTheme} />
      </View>

      <View style={styles.setting}>
        <Text>{t('language')}</Text>
        <Picker
          selectedValue={i18n.language}
          onValueChange={(itemValue) => changeLanguage(itemValue)}
        >
          <Picker.Item label={t('english')} value="en" />
          <Picker.Item label={t('portuguese')} value="pt" />
          <Picker.Item label={t('slovenian')} value="sl" />
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkMode ? '#000' : '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
  setting: {
    marginBottom: 16,
  },
});

export default SettingsScreen;
