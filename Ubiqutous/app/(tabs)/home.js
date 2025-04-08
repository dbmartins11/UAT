import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import { useFonts, Merriweather_700Bold } from '@expo-google-fonts/merriweather';
import AppLoading from 'expo-app-loading';
import { useRouter } from 'expo-router';
import SearchBar from '../../components/SearchBar';

export default function Home() {
    const [searchText, setSearchText] = useState('');
    const [fontsLoaded] = useFonts({
        Merriweather_700Bold,
    });

    const handleSearch = (text) => {
        setSearchText(text);
    }

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <View style={styles.homeImage}>
            <ImageBackground
                source={require('../../assets/images/HomePicture.png')}
                style={styles.imageBackground}>
                <Text style={styles.slogan}>Plan your Next </Text>
                <Text style={styles.slogan}>Vacation</Text>
                <Image
                    source={require('../../assets/images/icon.png')}
                    style={styles.icon} />
            </ImageBackground>
            <SearchBar 
                onSearch={handleSearch}/>
        </View>
    );
}

const styles = StyleSheet.create({
    homeImage: {
        height: '47%',
        width: '100%',
    },
    icon: {
        width: '20%',
        height: '20%',
        left: '40%',
        bottom: '40%',
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
    },
    slogan: {
        textAlign: 'left',
        fontSize: 35,
        bottom: '13%',
        width: '100%',
        paddingLeft: 20,
        fontFamily: 'Merriweather_700Bold',
        color: '#fff',
    },
});