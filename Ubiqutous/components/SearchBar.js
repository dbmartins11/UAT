import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SearchBar() {
    const router = useRouter();

    return (
        <View style={styles.bar}>
            <Ionicons name="search" size={20} color="#333333" style={{ marginRight: 10 }} />
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/(tabs)/Search')}
            >
                <Text>Search for a city, country or monument</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    bar: {
        display: 'flex',
        flexDirection: 'row',
        width: '80%',
        height: '5%',
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