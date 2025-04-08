import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar({ onSearch }) {
    const [searchText, setSearchText] = useState('');

    const handleChange = (text) => {
        setSearchText(text);
        if (onSearch) {
            onSearch(text);
        }
    };

    return (
        <View style={styles.bar}
        >
            <Ionicons name="search" size={20} color="#333333" style={{ marginRight: 10 }} />
            <TextInput
                placeholder="Search a country, city or monument"
                placeholderTextColor="#000"
                value={searchText}
                onChangeText={handleChange}
            >
            </TextInput>
        </View>
    );
}

const styles = StyleSheet.create({
    bar: {
        display: 'flex',
        flexDirection: 'row',
        width: '80%',
        height: '11%',
        padding: '2.4%',
        margin: '5%',
        alignSelf: 'center',
        borderRadius: 10,
        backgroundColor: '#DEEFFA',
    },
});