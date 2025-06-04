import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useFonts, Merriweather_700Bold } from '@expo-google-fonts/merriweather';
import { OpenSans_400Regular } from '@expo-google-fonts/open-sans';
import AppLoading from 'expo-app-loading';
import { useNavigation, Link } from 'expo-router';
import SearchBar from '../../components/SearchBar';
import { fetchImagesUnsplash } from '../../api/apiUnsplash.js';
import { PermissionsAndroid, Platform } from 'react-native';
import { auth } from '../../firebase/firebaseConf.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../components/ThemeContext';



export default function Home() {
    const navigation = useNavigation();
    const { darkMode } = useTheme();

    const [fontsLoaded] = useFonts({
        Merriweather_700Bold,
        OpenSans_400Regular,
    });
    const [urls, setUrls] = useState([]);
    const popularTouristCountries = [
        "Portugal",
        "France",
        "Spain", "USA",
        // "China", "Italy", "Turkey",
        // "Mexico", "Germany", "Thailand", "Greece", "Japan", "Brazil",
    ];


    useEffect(() => {
        console.log('User ID:', auth.currentUser?.uid);
        const storeUserID = async () => {
            try {await AsyncStorage.setItem('userID', auth.currentUser.uid);}
            catch (error) {
                console.error('Error saving user ID:', error);
        }};

        const requestLocationPermission = async () => {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            }
            return true;
        };

        const fetchData = async () => {
            try {
                const urls = await Promise.all(
                    popularTouristCountries.map(async (country) => {
                        const data = await fetchImagesUnsplash(country + " landmarks and tourism");
                        return data;
                    })
                );                
                setUrls(urls);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        storeUserID();
        fetchData();
        //requestLocationPermission();

    }, [])

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <View style={{ flex: 1, backgroundColor: darkMode ? '#000' : '#fff' }}>
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
            </View>
            <SearchBar/>
            <Text style={[styles.title, { color: darkMode ? '#fff' : '#000' }]}>Our Suggestions</Text>
            <ScrollView
                horizontal={true}
                //showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
                style={styles.countries}>

                {
                    urls.length > 0 ?
                        popularTouristCountries.map((country, index) => {
                            return (
                                <TouchableOpacity
                                    style={styles.countryBlock} key={index}
                                    onPress={() => navigation.navigate('country', {
                                        country: country,
                                        urls: urls[index]
                                    })}>
                                    <Image
                                        source={{ uri: urls[index][1] }}
                                        style={styles.countryImg} />
                                    <Text style={{ padding: '5%' }}>{country}</Text>
                                </TouchableOpacity >
                            )
                        })
                        :
                        <Text style={{ padding: '5%', color: darkMode ? '#fff' : '#000' }}>Loading...</Text>

                }

            </ScrollView>
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
        //justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'cover',
        paddingTop: '10%',
    },
    slogan: {
        textAlign: 'left',
        fontSize: 35,
        bottom: '10%',
        width: '100%',
        paddingLeft: 20,
        fontFamily: 'Merriweather_700Bold',
        color: '#fff',
    },
    title: {
        textAlign: 'center',
        fontSize: 30,
        fontFamily: 'OpenSans_400Regular',
    },
    countries: {
        width: '100%',
        height: 200,
    },
    scrollContainer: {
        flexDirection: 'row',
        paddingVertical: '7%',
        paddingHorizontal: 10,
    },
    countryBlock: {
        width: 150,
        height: 180,
        backgroundColor: '#DEEFFA',
        borderRadius: 10,
        borderColor: '#000',
        borderWidth: 1,
        marginRight: 10,
    },
    countryImg: {
        width: '100%',
        height: '70%',
        borderBottomColor: 'white',
        borderBottomWidth: 5,
        borderTopLeftRadius: 9,
        borderTopRightRadius: 9,
    },
});