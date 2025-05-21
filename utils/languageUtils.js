// utils/languageUtils.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_LANG = 'en';

const translations = {
  edit_profile: {
    en: 'Edit Profile',
    pt: 'Editar Perfil',
    sl: 'Uredi profil',
  },
  logout: {
    en: 'Logout',
    pt: 'Terminar Sessão',
    sl: 'Odjava',
  },
  visited_countries: {
    en: 'visited\ncountries',
    pt: 'países\nvisitados',
    sl: 'obiskane\ndržave',
  },
  wished_countries: {
    en: 'wished\ncountries',
    pt: 'países\ndesejados',
    sl: 'željene\ndržave',
  },
  my_lists: {
    en: 'my\nlists',
    pt: 'minhas\nlistas',
    sl: 'moji\nseznami',
  },
  visited_countries_section: {
    en: 'Visited Countries',
    pt: 'Países Visitados',
    sl: 'Obiskane Države',
  },
};

export const getCurrentLanguage = async () => {
  try {
    const lang = await AsyncStorage.getItem('appLanguage');
    return lang || DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
};

export const translate = (key, lang = DEFAULT_LANG) => {
  return translations[key]?.[lang] || translations[key]?.[DEFAULT_LANG] || key;
};
