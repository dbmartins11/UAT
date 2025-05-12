import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, ScrollView } from 'react-native';
import { useFonts, Merriweather_700Bold } from '@expo-google-fonts/merriweather';
import { OpenSans_400Regular } from '@expo-google-fonts/open-sans';
import { CrimsonText_400Regular } from '@expo-google-fonts/crimson-text';
import AppLoading from 'expo-app-loading';
import { useRoute } from '@react-navigation/native';
import { fetchCities, fetchImages, fetchImagesUnsplash } from '../../api/api.js';

export default function Country() {
    const route = useRoute();
    const { country, urls } = route.params;

    const [images, setImages] = useState([]);
    const [cities, setCities] = useState([]);
    const [citiesImg, setCitiesImg] = useState([]);
    const [fontsLoaded] = useFonts({
        Merriweather_700Bold,
        OpenSans_400Regular,
        CrimsonText_400Regular,
    });
 
    useEffect(() => {
        const getCountryImages =  () => { 
                const indImgs = [];
                while (indImgs.length < 4) {
                    const randomIndex = Math.floor(Math.random() * urls.length);
                    
                    if (!indImgs.includes(randomIndex) ) {      
                        indImgs.push(randomIndex);
                    }
                } 
                console.log("IMGS: " + indImgs[0] + ", " + indImgs[1] + ", " + indImgs[2] + ", " + indImgs[3]);
                setImages(indImgs);                
        };

        const fetchCitiesNames = async (country) => {
            const cities = [];
            try {
                const data = await fetchCities(country);
                cities.push(data[0]);
                cities.push(data[1]);
                setCities(cities);
                console.log("CITIES: " + data[0] + ", " + data[1]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        const fetchCitiesImages = async (cities) => {
            try {
                const urlsCities = [];
                for (let i = 0; i < cities.length; i++) {
                    const data = await fetchImagesUnsplash(cities[i]);
                    urlsCities.push(data);
                    console.log("CITIES IMAGES: " + cities[i]);
                }
                setCitiesImg(urlsCities);
                //console.log("CITIES IMAGES: " + urlsCities[0]); 
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        if(urls || urls.length !== 0){
            getCountryImages(); // Chama a função assíncrona
        }
        fetchCitiesNames(country);
        fetchCitiesImages(cities);
    }, [urls]);

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 10 }}>
            <View style={styles.imgBlock}>
                {urls[images[0]] && (
                    <Image
                        source={{ uri: urls[images[0]] }}
                        style={styles.firstImg}
                    />
                )}

                <View style={styles.imgBlock_1}>
                    {urls[images[1]] && (
                        <Image
                            source={{ uri: urls[images[1]] }}
                            style={styles.secondImg}
                        />
                    )}

                    <View style={styles.imgBlock_2}>
                        {urls[images[2]] && (
                            <Image
                                source={{ uri: urls[images[2]] }}
                                style={styles.thirdImg}
                            />
                        )}
                        {urls[images[3]] && (
                            <Image
                                source={{ uri: urls[images[3]] }}
                                style={styles.thirdImg}
                            />
                        )}
                    </View>
                </View>
            </View>
            {country ?
                <Text style={styles.title}>{country}</Text>
                :
                <Text style={styles.title}>Undefined</Text>
            }
            {/* {cities.length > 0 ? ( */}
                {cities.map((city, index) => (
                    <View key={index} style={styles.cities}>
                        <Text style={{ 
                            fontFamily: 'OpenSans_400Regular', 
                            fontSize: 17,
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            }}>
                            {city}
                        </Text>
                        {/* <Image
                            source={{ uri: citiesImg[0] }}
                            style={styles.thirdImg}>
                        </Image>
                        <Image
                            source={{ uri: citiesImg[1] }}
                            style={styles.thirdImg}>
                        </Image>
                        <Image
                            source={{ uri: citiesImg[2] }}
                            style={styles.thirdImg}>
                        </Image> */}
                    </View>
                ))}
            {/* ) : (
                <Text style={styles.title}>Loading...</Text>
            )} */}
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        marginVertical: '5%',
        textAlign: 'center',
        fontSize: 30,
        fontFamily: 'CrimsonText_400Regular',
    },
    imgBlock: {
        width: '100%',
        height: '40%',
        display: 'flex',
        flexDirection: 'row',
        gap: '2%'
    },
    imgBlock_1: {
        width: '50%',
        //height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '2%'
    },
    imgBlock_2: {
        width: '100%',
        height: '50%',
        display: 'flex',
        flexDirection: 'row',
        gap: '2%'
    },
    firstImg: {
        width: '50%',
        height: '100%',
        //borderRadius: 10,
        resizeMode: 'cover',
    },
    secondImg: {
        width: '100%',
        height: '50%',
        resizeMode: 'cover',
        //borderRadius: 10,
    },
    thirdImg: {
        width: '50%',
        height: '100%',
        resizeMode: 'cover',
        //borderRadius: 10,  
    },
    cities:{
        width: '90%',
        height: '15%',
        padding: '5%',
        justifyContent: 'center',
        marginHorizontal: 'auto',
        borderTopWidth: 1,
        borderTopColor: '#A0B5DB',
    }

});