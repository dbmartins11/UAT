import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchSearch } from '../../api/apiNominatim';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async (text) => {
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      let data = await fetchSearch(text);
      if (!data || data.length === 0) {
        data = [{ place_id: 0, display_name: 'Nothing found' }];
      }
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
    console.log('Selecionado:', item.display_name);
    // Podes agora decidir para onde navegas:
    // Por exemplo: navigation.navigate('city', { city: item.display_name });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#333333" style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Pesquisar cidades, países ou monumentos..."
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
      </View>

      {loading && <Text style={styles.loading}>A carregar sugestões...</Text>}

      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.place_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => handleSelectSuggestion(item)}
          >
            <Text style={styles.suggestionText}>{item.display_name}</Text>
          </TouchableOpacity>
        )}
      />
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
    height: '20%',
    paddingHorizontal: '3%',
    margin: '7%',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#DEEFFA',
    color: '#000',
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
