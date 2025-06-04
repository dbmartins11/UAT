import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, TextInput, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchSearch } from '../../api/apiNominatim';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useTheme } from '../../components/ThemeContext';


export default function SearchScreen() {
  const navigation = useNavigation();

  const { darkMode } = useTheme();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setQuery('');
      setSuggestions([]);
      setLoading(false);
      setSearched(false);
    }, [])
  );

  const fetchSuggestions = async (text) => {
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }
    else if (text.length >= 3) {
      setSearched(true);
    }

    setLoading(true);
    try {
      let data = await fetchSearch(text);
      setSuggestions(data);
    }
    catch (error) {
      console.error('Error fetching suggestions:', error);
    }
    setLoading(false);
  };


  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSuggestions(query);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelectSuggestion = (item) => {
    console.log('-------------------------');
    console.log('Selecionado:', item.addresstype);
    console.log('Selecionado:', item.display_name);
    console.log('-------------------------');
    console.log('Selecionado:', item);
    console.log('-------------------------');

    if (item.addresstype === 'man_made' || item.addresstype === 'tourism') {
      navigation.navigate('monument', {
        monument: item.name,
        city: item.address?.county || item.address?.city,
      });
    }

    else if (item.addresstype === 'country') {
      navigation.navigate('country', {
        country: item.name,
      });
    }
    
    else if (item.addresstype === 'county' || item.addresstype === 'city') {
      navigation.navigate('city', {
        city: item.name,
        country: item.address?.country,
      });
    }
    
    else {
      navigation.navigate('city', {
        city: item.name,
        country: item.address?.country,
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#000' : '#fff', flex: 1 }]}>
      <View style={[
          styles.searchBox,
          { backgroundColor: darkMode ? '#222' : '#DEEFFA' }
        ]}>
      <Ionicons name="search" size={20} color={darkMode ? '#fff' : '#333'} style={{ marginRight: 10 }} />

        <TextInput
          style={[styles.input, { color: darkMode ? '#fff' : '#000' }]}
          placeholder="Search for a city, country or monument"
          placeholderTextColor={darkMode ? '#aaa' : '#666'}
          value={query}
          onChangeText={setQuery}
        />

      </View>
 
      {loading && <Text style={[styles.loading, { color: darkMode ? '#ccc' : 'grey' }]}>Loading Suggestions</Text>}


      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.place_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
            styles.suggestionItem,
            { borderBottomColor: darkMode ? '#555' : '#ccc' }
            ]}
            onPress={() => handleSelectSuggestion(item)}
          >

            {item.name !== undefined && item.address && item.address.country !== undefined && (
              <Text style={[styles.suggestionText, { color: darkMode ? '#fff' : '#000' }]}>{item.name}, {item.address.country}</Text>
            )}
          </TouchableOpacity>
        )}
      />
      {suggestions.length === 0 && !loading && searched && (
        <Text style={styles.loading}>No Suggestions Found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: '2%',
  },
  searchBox: {
    display: 'flex',
    flexDirection: 'row',
    width: '80%',
    height: 50,
    paddingHorizontal: '3%',
    margin: '7%',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#DEEFFA',
    color: '#000',
  },
  input: {
    flex: 1,
    width: '100%',
  },
  loading: {
    marginTop: 10,
    fontSize: 12,
    color: 'grey',
  },
  suggestionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  suggestionText: {
    fontSize: 16,
  },
});
