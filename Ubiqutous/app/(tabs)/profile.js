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

export default function ProfileScreen() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [aboutMe, setAboutMe] = useState('');

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        try {
          const user = auth.currentUser;
          if (!user) return;

          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUsername(data.username || 'Unnamed');
            setEmail(data.email || user.email);
            setAboutMe(data.aboutMe || '');
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
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
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Avatar com inicial */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{firstLetter}</Text>
        </View>

        <Text style={styles.username}>{username}</Text>
        <Text style={styles.about}>{aboutMe}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>visited{'\n'}countries</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>wished{'\n'}countries</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>my{'\n'}lists</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Visited Countries</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.countriesScroll}>
          {visitedCountries.map((country, index) => (
            <View key={index} style={styles.countryCard}>
              <Image source={country.image} style={styles.countryImage} />
              <Text style={styles.countryLabel}>{country.flag} {country.name}</Text>
            </View>
          ))}
        </ScrollView>

        {myLists.map((item, index) => (
          <View key={index} style={styles.listCard}>
            <View>
              <Text style={styles.listTitle}>{item.title}</Text>
              <Text style={styles.listDescription}>{item.description}</Text>
            </View>
            <Image source={item.image} style={styles.listImage} />
          </View>
        ))}

        <TouchableOpacity style={styles.editButton} onPress={() => router.push('/editprofile')}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
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
