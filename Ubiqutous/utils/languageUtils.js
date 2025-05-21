// utils/languageUtils.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const translations = {
  en: {
    visited_countries: 'Visited\nCountries',
    wished_countries: 'Wished\nCountries',
    my_lists: 'My\nLists',
    visited_countries_section: 'Visited Countries',
    edit_profile: 'Edit Profile',
    logout: 'Logout',
  },
  pt: {
    visited_countries: 'Países\nVisitados',
    wished_countries: 'Países\nDesejados',
    my_lists: 'Minhas\nListas',
    visited_countries_section: 'Países Visitados',
    edit_profile: 'Editar Perfil',
    logout: 'Sair',
  },
  sl: {
    visited_countries: 'Obiskane\nDržave',
    wished_countries: 'Željene\nDržave',
    my_lists: 'Moji\nSeznami',
    visited_countries_section: 'Obiskane Države',
    edit_profile: 'Uredi Profil',
    logout: 'Odjava',
  }
};

// Obter idioma atual da AsyncStorage
export const getCurrentLanguage = async () => {
  const lang = await AsyncStorage.getItem('appLanguage');
  return lang || 'en'; // padrão: inglês
};

// Traduzir uma chave com base no idioma
export const translate = (key, lang = 'en') => {
  return translations[lang]?.[key] || translations['en']?.[key] || key;
};
