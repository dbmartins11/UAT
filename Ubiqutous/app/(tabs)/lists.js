import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, collection } from 'firebase/firestore';

import { auth, db } from '../../firebase/firebaseConf';
import { useFocusEffect } from '@react-navigation/native';

import { useRoute } from '@react-navigation/native';

export default function ListScreen() {
  const route = useRoute();
  const { userID, listName } = route.params;

  const [listContent, setList] = useState([]);
 
  useEffect(() => {
    const getLists = async () => {
              if (!userID) return;
              try {
                    const listRef = doc(db, 'users', userID, 'lists', listName);
                    const snapshot = await getDoc(listRef);
                    if (snapshot.exists()) {
                      setList([ { id: snapshot.id, ...snapshot.data() } ]);
                    } else {
                      setList([]);
                    }
                    console.log('List fetched:', listContent);
              } catch (error) {
                  console.error('Error fetching lists:', error);
              }
          };
          
      getLists();
  }, [])


  useFocusEffect(
    useCallback(() => {
      let isActive = true;
  
      const getLists = async () => {
            if (!userID) return;
            try {
                  const listRef = doc(db, 'users', userID, 'lists', listName);
                  const snapshot = await getDoc(listRef);
                  if (snapshot.exists()) {
                    setList([ { id: snapshot.id, ...snapshot.data() } ]);
                  } else {
                    setList([]);
                  }
                  console.log('List fetched:', listContent);
            } catch (error) {
                console.error('Error fetching lists:', error);
            }
        };
      getLists();
  
      return () => {
        isActive = false;
      };
    }, []) // Deixa dependências vazias!
  );
  


  const navigation = useNavigation();

  return (
    <ScrollView style={styles.background}>
      <View style={{ position: 'absolute', top: 40, left: 20, zIndex: 1 }}>
        <Text
          style={{
            fontSize: 18,
            color: '#3A5BA0',
            fontWeight: 'bold',
            padding: 8,
          }}
          onPress={() => navigation.goBack()}
        >
          ← Back
        </Text>
      </View>

      <Text style={styles.sectionTitle}>List: {listName}</Text>
    </ScrollView>
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
