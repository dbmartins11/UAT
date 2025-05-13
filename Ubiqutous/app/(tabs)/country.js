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
        const getCountryImages = () => {
            console.log("1")
            const indImgs = [];
            while (indImgs.length < 4) {
                const randomIndex = Math.floor(Math.random() * urls.length);

                if (!indImgs.includes(randomIndex)) {
                    indImgs.push(randomIndex);
                }
            }
            console.log("IMGS: " + indImgs[0] + ", " + indImgs[1] + ", " + indImgs[2] + ", " + indImgs[3]);
            setImages(indImgs);
        };

        const fetchData = async (country) => {
            console.log("2")
            let dataNames = [];
            try {
                dataNames = await fetchCities(country + "+all");
                console.log("CITIES: " + dataNames);
                setCities(dataNames);
                console.log("3")
            } catch (error) {
                console.error('Error fetching the cities\' names:', error);
            }
            try {
                console.log("4")
                let urls = [];
                for (const city of dataNames) {
                    {
                        const data = await fetchImagesUnsplash(city);
                        urls.push(data);
                    }
                }
                console.log("CITIES IMGS: " + urls.length);
                console.log("CITIES IMGS: " + urls[0].length);
                setCitiesImg(urls);
                console.log("5")
            } catch (error) {
                console.error('Error fetching the cities\' images:', error);
            }
        }

        fetchData(country);

        if (urls || urls.length !== 0) {
            console.log("6")
            getCountryImages();
        }

        console.log("7")

    }, [])

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <View style={{ flex: 1, padding: 10 }}>
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
            <ScrollView
                horizontal={false}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={styles.scrollContainer}
            >
                {citiesImg.length > 0 ? (
                    cities.map((city, index) => (
                        <View key={index} style={styles.cities}>
                            <View style={{ width: '30%', justifyContent: 'center' }}>
                                <Text style={{
                                    fontFamily: 'OpenSans_400Regular',
                                    fontSize: 17,
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                }}>
                                    {city}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', width: '70%', marginHorizontal: 'auto' }}>
                                <Image
                                    source={{ uri: citiesImg[index][0] }}
                                    style={styles.cityImg}>
                                </Image>
                                <Image
                                    source={{ uri: citiesImg[index][1] }}
                                    style={styles.cityImg}>
                                </Image>
                                <Image
                                    source={{ uri: citiesImg[index][2] }}
                                    style={styles.cityImg}>
                                </Image>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.title}>Loading...</Text>
                )}
            </ScrollView>
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
        width: '48%',
        //height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '2%'
    },
    imgBlock_2: {
        width: '98%',
        height: '48%',
        display: 'flex',
        flexDirection: 'row',
        gap: '2%'
    },
    firstImg: {
        width: '50%',
        height: '100%',
        borderRadius: 5,
        resizeMode: 'cover',
    },
    secondImg: {
        width: '100%',
        height: '50%',
        resizeMode: 'cover',
        borderRadius: 5,
    },
    thirdImg: {
        width: '50%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 5,
    },
    cities: {
        width: '100%',
        height: 120,
        padding: '2%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderTopWidth: 1,
        borderTopColor: '#A0B5DB',
    },

    cityImg: {
        width: '30%',
        height: '100%',
        borderRadius: 10,
        marginRight: '5%',
    },

    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },

});