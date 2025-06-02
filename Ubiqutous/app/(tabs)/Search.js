import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
import { search } from '../../api/serpApi';

export default function Search() {
    const navigation = useNavigation();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await search('Countries: Portugal');
                console.log(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <View>
            <Text>Search Results</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    
});
