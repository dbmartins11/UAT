import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, ScrollView } from 'react-native';
import { useFonts, Merriweather_700Bold } from '@expo-google-fonts/merriweather';
import { OpenSans_600SemiBold } from '@expo-google-fonts/open-sans';
import { CrimsonText_400Regular } from '@expo-google-fonts/crimson-text';
import AppLoading from 'expo-app-loading';
import { useRoute } from '@react-navigation/native';
import { fetchMonumentDescription } from '../../api/api.js';
import { useNavigation } from 'expo-router';
import BackButton from '../../components/backButton.js';

export default function Monument() {
    const [fontsLoaded] = useFonts({
        Merriweather_700Bold,
        OpenSans_600SemiBold,
        CrimsonText_400Regular,
    });
    const [description, setDescription] = useState([]);
    const route = useRoute();
    const { monument, url } = route.params;

    useEffect(() => {
        const fetchData = async (monument) => {
            try {
                const data = await fetchMonumentDescription(monument);
                console.log("API MONUMENT DESCRIPTION: " + data);
                setDescription(data);
            } catch (error) {
                console.error('Error fetching the cities\' names:', error);
            }
        }
        fetchData(monument);
    }, [url])

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.main}>
                <ImageBackground
                    source={{ uri: url[7] }}
                    style={styles.mainImg}>
                    <BackButton style={styles.backButtonOverlay} />
                </ImageBackground>
            </View>
            <Text style={styles.description}>
                {description}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        height: '35%',
        marginBottom: '3%',
        borderBottomLeftRadius: "45%",
        overflow: 'hidden',
    },
    mainImg: {
        height: '100%',
        justifyContent: 'flex-start',
    },
    backButtonOverlay: {
        position: 'absolute',
        marginTop: '4%',
        left: '4%',
    },
    description: {
        textAlign: 'justify', 
        margin: "7%",
        fontFamily: 'OpenSans_600SemiBold',
        fontSize: 18,
    },
});