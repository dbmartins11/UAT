import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';

import BackButton from '../../components/backButton.js';
import { db } from '../../firebase/firebaseConf';
import { useFocusEffect } from '@react-navigation/native';

import { useRoute } from '@react-navigation/native';
import { useTheme } from '../../components/ThemeContext';


export default function ListScreen() {
  const route = useRoute();
  const { userID, listName } = route.params;
  const [listContent, setListContent] = useState(null); // Use null to indicate no data initially
  const navigation = useNavigation();
  const [descriptions, setDescriptions] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteType, setDeleteType] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState({});
  const { darkMode } = useTheme();



  useEffect(() => {
    console.log('ListScreen rendered with params:', route.params);
    if (!userID || !listName) {
      console.warn('Missing userID or listName in route.params:', { userID, listName });
    }
  }, [route.params, userID, listName]);

  // Reset state when listName changes
  useEffect(() => {
    console.log('listName changed to:', listName);
    setListContent(null);
    setDescriptions({});
    fetchListData();
  }, [listName]);

  const fetchListData = useCallback(async () => {
    if (!userID || !listName) {
      console.warn('Cannot fetch list data: missing userID or listName', { userID, listName });
      return;
    }
    try {
      console.log('Fetching list data for:', listName, 'User:', userID);
      console.log('Firestore path:', `users/${userID}/lists/${listName}`);
      const listRef = doc(db, 'users', userID, 'lists', listName);
      const snapshot = await getDoc(listRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        console.log('Fetched list data:', data);
        setListContent(data);
        const initialDescriptions = {};
        Object.keys(data.countries || {}).forEach(country => {
          initialDescriptions[country] = data.countries[country].description || '';
        });
        setDescriptions(initialDescriptions);
      } else {
        console.log('No list found for:', listName);
        setListContent(null);
        setDescriptions({});
      }
    } catch (error) {
      console.error('Error fetching list:', error);
    }

  }, [userID, listName]);

  useFocusEffect(
    useCallback(() => {
      console.log('Screen focused, reloading data for list:', listName);
      fetchListData();
      return () => {
        console.log('Screen unfocused, cleaning up');
      };
    }, [fetchListData, listName])
  );

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

  const handleDeleteCountry = async (country) => {
    try {
      const listRef = doc(db, 'users', userID, 'lists', listName);
      const updatedCountries = { ...listContent.countries };
      delete updatedCountries[country];
      await updateDoc(listRef, { countries: updatedCountries });
      fetchListData();
    } catch (error) {
      console.error('Error deleting country:', error);
    }
  };

  const handleDeleteCity = async (country, city) => {
    try {
      const listRef = doc(db, 'users', userID, 'lists', listName);
      const updatedCountries = { ...listContent.countries };
      if (updatedCountries[country] && updatedCountries[country].cities) {
        delete updatedCountries[country].cities[city];
        await updateDoc(listRef, { countries: updatedCountries });
        fetchListData();
      }
    } catch (error) {
      console.error('Error deleting city:', error);
    }
  };

  const handleDeleteMonument = async (country, city, monument) => {
    try {
      const listRef = doc(db, 'users', userID, 'lists', listName);
      const updatedCountries = { ...listContent.countries };
      if (updatedCountries[country] && updatedCountries[country].cities[city]) {
        updatedCountries[country].cities[city].monuments =
          updatedCountries[country].cities[city].monuments.filter(m => m.name !== monument.name);
        await updateDoc(listRef, { countries: updatedCountries });
        fetchListData();
      }
    } catch (error) {
      console.error('Error deleting monument:', error);
    }
  };

  const confirmDelete = () => {
    if (deleteType === 'list') {
      handleDeleteList();
    } else if (deleteType === 'country') {
      handleDeleteCountry(deleteTarget.country);
    } else if (deleteType === 'city') {
      handleDeleteCity(deleteTarget.country, deleteTarget.city);
    } else if (deleteType === 'monument') {
      handleDeleteMonument(deleteTarget.country, deleteTarget.city, deleteTarget.monument);
    }
    setModalVisible(false);
    setDeleteType(null);
    setDeleteTarget({});
  };

  const openDeleteModal = (type, target) => {
    setDeleteType(type);
    setDeleteTarget(target);
    setModalVisible(true);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: darkMode ? '#000' : '#fff' }]}>
      <BackButton
        onPress={() => navigation.navigate('profile')}
      ></BackButton>
      <Text style={[styles.sectionTitle, { color: darkMode ? '#fff' : '#000' }]}>List: {listName}</Text>

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
                <Text style={[styles.countryText, { color: darkMode ? '#fff' : '#000' }]}>{country}</Text>
                <TouchableOpacity
                  onPress={() => openDeleteModal('country', { country })}
                >
                  <Image
                    source={require('../../assets/icons/close.png')}
                    style={{ width: 14, height: 14, marginLeft: 20, marginTop: 4 }}>
                  </Image>
                </TouchableOpacity>
              </View>
              {
                (!countryData.cities || Object.keys(countryData.cities).length === 0) ? (
                  <Text style={[styles.noDataText, { color: darkMode ? '#ccc' : '#555' }]}>No cities saved for this country</Text>
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
                        <Text style={[styles.cityText, { color: darkMode ? '#fff' : '#000' }]}>{city}</Text>
                        <TouchableOpacity
                          onPress={() => openDeleteModal('city', { country, city })}
                        >
                          <Image
                            source={require('../../assets/icons/close.png')}
                            style={{ width: 12, height: 12, marginLeft: 20, marginTop: 2 }}>
                          </Image>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.monumentContainer}>
                        {
                          (!cityData.monuments || cityData.monuments.length === 0) ? (
                            <Text style={[styles.noDataText, { color: darkMode ? '#ccc' : '#555' }]}>No monuments saved for this city</Text>
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
                                <Text style={[styles.monumentText, { color: darkMode ? '#fff' : '#000' }]}>
                                  {monument.name || 'Unnamed Monument'}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => openDeleteModal('monument', { country, city, monument })}
                                >
                                  <Image
                                    source={require('../../assets/icons/close.png')}
                                    style={{ width: 10, height: 10, marginLeft: 20, marginTop: 3 }}>
                                  </Image>
                                </TouchableOpacity>
                              </View>
                            ))
                          )
                        }
                      </View>
                    </View>
                  ))
                )
              }
            </View>
          ))
        ) : (
          <Text style={[styles.noDataText, { color: darkMode ? '#ccc' : '#555' }]}>No attractions in this list</Text>
        )
      ) : (
        <Text style={[styles.noDataText, { color: darkMode ? '#ccc' : '#555' }]}>List not found</Text>
      )}

      <TouchableOpacity style={styles.deleteButton} onPress={() => openDeleteModal('list', {})}>
        <Text style={[styles.deleteButtonText, { color: 'white' }]}>Delete List</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setDeleteType(null);
          setDeleteTarget({});
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: darkMode ? '#fff' : '#000' }]}>Confirm Deletion</Text>
            <Text style={[styles.modalText, { color: darkMode ? '#fff' : '#000' }]}>
              Are you sure you want to delete{' '}
              {deleteType === 'list' ? 'this list' :
                deleteType === 'country' ? `the country "${deleteTarget.country}"` :
                  deleteType === 'city' ? `the city "${deleteTarget.city}"` :
                    `the monument "${deleteTarget.monument?.name || 'Unnamed Monument'}"`}?
            </Text>
            <View style={styles.modalButtonContainer}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setDeleteType(null);
                  setDeleteTarget({});
                }}
              >
                <Text style={[styles.modalButtonText, { color: 'white' }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmDelete}
              >
                <Text style={[styles.modalButtonText, { color: 'white' }]}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    marginTop: 10,
    marginLeft: 10,
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
  deleteItemButton: {
    backgroundColor: '#a03a3a',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteItemButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  descriptionContainer: {
    marginLeft: 24,
    marginBottom: 10,
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#555',
  },
  confirmButton: {
    backgroundColor: '#a03a3a',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});