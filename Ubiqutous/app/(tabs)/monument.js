import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, ScrollView } from 'react-native';
import { useFonts, Merriweather_700Bold } from '@expo-google-fonts/merriweather';
import { OpenSans_600SemiBold } from '@expo-google-fonts/open-sans';
import { CrimsonText_400Regular } from '@expo-google-fonts/crimson-text';
import AppLoading from 'expo-app-loading';
import { useRoute } from '@react-navigation/native';
import { fetchMonumentDescription } from '../../api/apiWikipedia.js';
import { fetchCoordinates } from '../../api/apiNominatim.js';
import { useNavigation } from 'expo-router';
import BackButton from '../../components/backButton.js';
import MapView, { Marker } from 'react-native-maps';
import { Dimensions } from 'react-native';
import * as Location from 'expo-location';
const { height: screenHeight } = Dimensions.get('window');

export default function Monument() {
    const [fontsLoaded] = useFonts({
        Merriweather_700Bold,
        OpenSans_600SemiBold,
        CrimsonText_400Regular,
    });
    const [description, setDescription] = useState([]);
    const [coordinatesC, setCoordinatesC] = useState([]);
    const [selfCoordinates, setSelfCoordinates] = useState([]);
    const [MCoordinates, setMCoordinates] = useState([]);
    const route = useRoute();
    const { monument, city, url } = route.params;

    useEffect(() => {
        //monument === undefined ? monument = "Torre Eiffel" : monument = monument; 
        const fetchData = async (monument) => {
            try {
                const data = await fetchMonumentDescription(monument);
                setDescription(data);
            } catch (error) {
                console.error('Error fetching the cities\' names:', error);
            }
        }

        const fetchCoordinatesC = async (monument) => {
            try {
                const coordsC = await fetchCoordinates(city);
                setCoordinatesC(coordsC);
            } catch (error) {
                console.error('Error fetching the coordinates:', error);
            }
        }

        const fetchCoordinatesM = async (monument) => {
            try {
                const coordsM = await fetchCoordinates(monument + ", " + city);
                setMCoordinates(coordsM);
            } catch (error) {
                console.error('Error fetching the coordinates:', error);
            }
        }

        const getLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.log('Permission to access location was denied');
                    return null;
                }
                const location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;
                setSelfCoordinates([latitude, longitude]);
            }
            catch (error) {
                console.error('Error getting location:', error);
            }
        }

        fetchData(monument);
        getLocation();
        fetchCoordinatesC(monument);
        fetchCoordinatesM(monument);
    }, [url])

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <ScrollView
            horizontal={false}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollContainer}>
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
            {coordinatesC.length > 0 ? (
                <MapView
                    style={{ width: '100%', height: screenHeight * 0.4 }}
                    initialRegion={{
                        latitude: coordinatesC[0],
                        longitude: coordinatesC[1],
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {MCoordinates.length > 0 && (
                        <Marker
                            coordinate={{
                                latitude: MCoordinates[0],
                                longitude: MCoordinates[1],
                            }}
                            title={monument}
                            description={description}
                        />
                    )}
                    {selfCoordinates.length > 0 && (
                        <Marker
                            coordinate={{
                                latitude: selfCoordinates[0],
                                longitude: selfCoordinates[1],
                            }}
                            title="Você está aqui"
                        />
                    )}
                </MapView>

            ):(
                <Text style={styles.description}>
                    Loading map...
                </Text>)
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    main: {
        height: screenHeight * 0.35,
        marginBottom: 16,
        borderBottomLeftRadius: screenHeight * 0.10,
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

    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
});