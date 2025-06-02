import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, collection, deleteDoc, updateDoc } from 'firebase/firestore';

import { auth, db } from '../../firebase/firebaseConf';
import { useFocusEffect } from '@react-navigation/native';

import { useRoute } from '@react-navigation/native';

export default function ListScreen() {
const route = useRoute();
  const { userID, listName } = route.params;
  const [listContent, setListContent] = useState(null); // Use null to indicate no data initially
  const navigation = useNavigation();

  useEffect(() => {
    fetchListData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchListData();
    }, [])
  );

  const fetchListData = async () => {
    if (!userID) return;
    try {
      const listRef = doc(db, 'users', userID, 'lists', listName);
      const snapshot = await getDoc(listRef);
      if (snapshot.exists()) {
        setListContent(snapshot.data());
      } else {
        setListContent(null);
      }
    } catch (error) {
      console.error('Error fetching list:', error);
    }
  };

  const handleDeleteList = async () => {
    try {
      const listRef = doc(db, 'users', userID, 'lists', listName);
      await deleteDoc(listRef);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

const handleToggleCountryVisited = async (country) => {
    try {
      const listRef = doc(db, 'users', userID, 'lists', listName);
      const updatedCountries = { ...listContent.countries };
      if (updatedCountries[country]) {
        updatedCountries[country].visited = !updatedCountries[country].visited;
        await updateDoc(listRef, { countries: updatedCountries });
        fetchListData();
      }
    } catch (error) {
      console.error('Error updating country visited status:', error);
    }
  };

  const handleToggleCityVisited = async (country, city) => {
    try {
      const listRef = doc(db, 'users', userID, 'lists', listName);
      const updatedCountries = { ...listContent.countries };
      if (updatedCountries[country].cities[city]) {
        updatedCountries[country].cities[city].visited = !updatedCountries[country].cities[city].visited;
        await updateDoc(listRef, { countries: updatedCountries });
        fetchListData();
      }
    } catch (error) {
      console.error('Error updating city visited status:', error);
    }
  };

  const handleToggleVisited = async (country, city, monument) => {
    try {
      const listRef = doc(db, 'users', userID, 'lists', listName);
      const updatedCountries = { ...listContent.countries };
      const monumentIndex = updatedCountries[country].cities[city].monuments.findIndex(m => m.name === monument.name);
      if (monumentIndex !== -1) {
        updatedCountries[country].cities[city].monuments[monumentIndex].visited = !monument.visited;
      } else {
        console.log('Monument not found:', monument);
      }
      await updateDoc(listRef, { countries: updatedCountries });
      fetchListData();
    } catch (error) {
      console.error('Error updating monument visited status:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.backButtonContainer}>
        <Text
          style={styles.backButtonText}
          onPress={() => navigation.goBack()}
        >
          ← Back
        </Text>
      </View>

      <Text style={styles.sectionTitle}>List: {listName}</Text>

      {listContent ? (
        Object.keys(listContent.countries).length > 0 ? (
          Object.entries(listContent.countries).map(([country, countryData]) => (
            <View key={country} style={styles.entryContainer}>
              <View style={styles.itemContainer}>
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => handleToggleCountryVisited(country)}
                >
                  <Text style={styles.toggleButtonText}>
                    {countryData.visited ? 'X' : ''}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.countryText}>{country}</Text>
              </View>
              {
                (!countryData.cities || Object.keys(countryData.cities).length === 0) ? (
                  <Text style={styles.noDataText}>No cities saved for this country</Text>
                ) : (
                  Object.entries(countryData.cities).map(([city, cityData]) => (
                    <View key={city} style={styles.cityContainer}>
                      <View style={styles.itemContainer}>
                        <TouchableOpacity
                          style={styles.toggleButton}
                          onPress={() => handleToggleCityVisited(country, city)}
                        >
                          <Text style={styles.toggleButtonText}>
                            {cityData.visited ? 'X' : ''}
                          </Text>
                        </TouchableOpacity>
                        <Text style={styles.cityText}>{city}</Text>
                      </View>
                      <View style={styles.monumentContainer}>
                        
                        {
                         (!cityData.monuments || cityData.monuments.length === 0) ? (
                          <Text style={styles.noDataText}>No monuments saved for this city</Text>
                         ) : (
                        cityData.monuments.map((monument, index) => (
                          <View key={index} style={styles.itemContainer}>
                            <TouchableOpacity
                              style={styles.toggleButton}
                              onPress={() => handleToggleVisited(country, city, monument)}
                            >
                              <Text style={styles.toggleButtonText}>
                                {monument.visited ? 'X' : ''}
                              </Text>
                            </TouchableOpacity>
                            <Text style={styles.monumentText}>
                              {monument.name || 'Unnamed Monument'}
                            </Text>
                          </View>
                        )))}
                      </View>
                    </View>
                  ))
                )
              }
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No attractions in this list</Text>
        )
      ) : (
        <Text style={styles.noDataText}>List not found</Text>
      )}

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteList}>
        <Text style={styles.deleteButtonText}>Delete List</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 2,
    left: 10,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 18,
    color: '#3A5BA0',
    fontWeight: 'bold',
    padding: 8,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    marginTop: 60,
    marginLeft: 20,
  },
  entryContainer: {
    marginLeft: 20,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleButton: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  toggleButtonText: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  countryText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cityContainer: {
    marginLeft: 20,
  },
  cityText: {
    fontSize: 20,
    fontWeight: '600',
  },
  monumentContainer: {
    marginLeft: 20,
  },
  monumentText: {
    fontSize: 16,
  },
  noDataText: {
    fontSize: 12,
    color: '#555',
  },
  deleteButton: {
    backgroundColor: '#a03a3a',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});