import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase/firebaseConf';
import { doc, getDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../components/ThemeContext';
import { getCurrentLanguage, translate } from '../../utils/languageUtils';




export default function ProfileScreen() {
  const router = useRouter();
  const { darkMode } = useTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [language, setLanguage] = useState('en');

  useFocusEffect(
  useCallback(() => {
    let isActive = true;

    const fetchData = async () => {
      try {
        const lang = await getCurrentLanguage();
        if (isActive) setLanguage(lang);

        const user = auth.currentUser;
        if (!user) return;

        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && isActive) {
          const data = docSnap.data();
          setUsername(data.username || 'Unnamed');
          setEmail(data.email || user.email);
          setAboutMe(data.aboutMe || '');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();

    return () => {
      isActive = false;
    };
  }, [])
);


  const firstLetter = username.charAt(0).toUpperCase();

  const visitedCountries = [
    { name: 'Madeira', flag: '🇵🇹', image: require('../../assets/images/madeira.png') },
    { name: 'Maribor', flag: '🇸🇮', image: require('../../assets/images/maribor.png') },
    { name: 'Krakow', flag: '🇵🇱', image: require('../../assets/images/krakow.png') },
  ];

  const myLists = [
    { title: 'Minha Lista 1', description: 'descrição', image: require('../../assets/images/krakow.png') },
    { title: 'Minha Lista 2', description: 'descrição', image: require('../../assets/images/madeira.png') },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      alert('Error during logout: ' + error.message);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={[styles.background, darkMode && { backgroundColor: '#111' }]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.avatar, darkMode && { backgroundColor: '#444' }]}>
          <Text style={styles.avatarText}>{firstLetter}</Text>
        </View>

        <Text style={[styles.username, darkMode && { color: '#fff' }]}>{username}</Text>
        <Text style={[styles.about, darkMode && { color: '#ccc' }]}>{aboutMe}</Text>

        <View style={styles.statsRow}>
          <View style={[styles.statBox, darkMode && { backgroundColor: '#333' }]}>
            <Text style={[styles.statNumber, darkMode && { color: '#fff' }]}>5</Text>
            <Text style={[styles.statLabel, darkMode && { color: '#ccc' }]}>{translate('visited_countries', language)}</Text>
          </View>
          <View style={[styles.statBox, darkMode && { backgroundColor: '#333' }]}>
            <Text style={[styles.statNumber, darkMode && { color: '#fff' }]}>12</Text>
            <Text style={[styles.statLabel, darkMode && { color: '#ccc' }]}>{translate('wished_countries', language)}</Text>
          </View>
          <View style={[styles.statBox, darkMode && { backgroundColor: '#333' }]}>
            <Text style={[styles.statNumber, darkMode && { color: '#fff' }]}>5</Text>
            <Text style={[styles.statLabel, darkMode && { color: '#ccc' }]}>{translate('my_lists', language)}</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, darkMode && { color: '#fff' }]}>
          {translate('visited_countries_section', language)}
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.countriesScroll}>
          {visitedCountries.map((country, index) => (
            <View key={index} style={styles.countryCard}>
              <Image source={country.image} style={styles.countryImage} />
              <Text style={[styles.countryLabel, darkMode && { color: '#fff' }]}>
                {country.flag} {country.name}
              </Text>
            </View>
          ))}
        </ScrollView>

        {myLists.map((item, index) => (
          <View key={index} style={[styles.listCard, darkMode && { backgroundColor: '#333' }]}>
            <View>
              <Text style={[styles.listTitle, darkMode && { color: '#fff' }]}>{item.title}</Text>
              <Text style={[styles.listDescription, darkMode && { color: '#ccc' }]}>{item.description}</Text>
            </View>
            <Image source={item.image} style={styles.listImage} />
          </View>
        ))}

        <TouchableOpacity style={styles.editButton} onPress={() => router.push('/editprofile')}>
          <Text style={styles.editButtonText}>{translate('edit_profile', language)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>{translate('logout', language)}</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}



const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3A5BA0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  username: {
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 4,
  },
  about: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#dbe7fb',
    borderRadius: 10,
    width: 90,
  },
  statNumber: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#3A5BA0',
  },
  statLabel: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  countriesScroll: {
    maxHeight: 120,
    marginBottom: 20,
  },
  countryCard: {
    marginRight: 12,
    alignItems: 'center',
  },
  countryImage: {
    width: 90,
    height: 60,
    borderRadius: 8,
    marginBottom: 4,
  },
  countryLabel: {
    fontSize: 12,
  },
  listCard: {
    backgroundColor: '#dbe7fb',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  listTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  listDescription: {
    fontSize: 12,
    color: '#555',
  },
  listImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  editButton: {
    backgroundColor: '#3A5BA0',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#a03a3a',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
