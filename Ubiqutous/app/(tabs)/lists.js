import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase/firebaseConf';
import { doc, getDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

export default function ListScreen() {
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
        <View style={{ flex: 1, padding: 10 }}>
            <View style={styles.imgBlock}>
                {urls[images[0]] && (
                    <Image
                        source={{ uri: urls[images[0]] }}
                        style={styles.firstImg}
                    />
                )}

                <View style={styles.imgBlock_1}>
                    {urls[images[1]] && (
                        <Image
                            source={{ uri: urls[images[1]] }}
                            style={styles.secondImg}
                        />
                    )}

                    <View style={styles.imgBlock_2}>
                        {urls[images[2]] && (
                            <Image
                                source={{ uri: urls[images[2]] }}
                                style={styles.thirdImg}
                            />
                        )}
                        {urls[images[3]] && (
                            <Image
                                source={{ uri: urls[images[3]] }}
                                style={styles.thirdImg}
                            />
                        )}
                    </View>
                </View>
            </View>
            {country ?
                <Text style={styles.title}>{country}</Text>
                :
                <Text style={styles.title}>Undefined</Text>
            }
            <ScrollView
                horizontal={false}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={styles.scrollContainer}
            >
                {citiesImg.length > 0 ? (
                    cities.map((city, index) => (
                        <View key={index} style={styles.cities}>
                            <View style={{ width: '30%', justifyContent: 'center' }}>
                                <Text style={{
                                    fontFamily: 'OpenSans_400Regular',
                                    fontSize: 17,
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                }}>
                                    {city}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', width: '70%', marginHorizontal: 'auto' }}>
                                <Image
                                    source={{ uri: citiesImg[index][0] }}
                                    style={styles.cityImg}>
                                </Image>
                                <Image
                                    source={{ uri: citiesImg[index][1] }}
                                    style={styles.cityImg}>
                                </Image>
                                <Image
                                    source={{ uri: citiesImg[index][2] }}
                                    style={styles.cityImg}>
                                </Image>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.title}>Loading...</Text>
                )}
            </ScrollView>
        </View>
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
