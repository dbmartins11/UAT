import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SearchBar() {
    const router = useRouter();

    const [lang, setLang] = useState('en');

    useFocusEffect(
        useCallback(() => {
        const getLang = async () => {
            const language = await AsyncStorage.getItem('appLanguage');
            setLang(language || 'en');
        };
        getLang();
        }, [])
    );

    const searchText = {
        en: "Search for a city, country or monument",
        pt: "Pesquise por cidade, país ou monumento",
        sl: "Poišči mesto, državo ali spomenik"
    };

    return (
        <View style={styles.bar}>
            <Ionicons name="search" size={20} color="#333333" style={{ marginRight: 10 }} />
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/(tabs)/Search')}
            >
                <Text>{searchText[lang] || searchText.en}</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    bar: {
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
    button: {
        height: '100vh',
        width: '100vw',
        backgroundColor: 'none',
        color: '#000',
    }
});