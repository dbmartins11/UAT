import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useFonts, Merriweather_700Bold } from '@expo-google-fonts/merriweather';
import { OpenSans_400Regular } from '@expo-google-fonts/open-sans';
import { CrimsonText_400Regular } from '@expo-google-fonts/crimson-text';
import AppLoading from 'expo-app-loading';
import { useRoute } from '@react-navigation/native';
import { fetchCities, fetchImages } from '../../api/serpApi.js';
import { fetchImagesUnsplash } from '../../api/apiUnsplash.js';
import { useNavigation } from 'expo-router';
import BackButton from '../../components/backButton.js';
import { MenuProvider } from 'react-native-popup-menu';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';



export default function Country() {
    const navigation = useNavigation();
    const route = useRoute();
    const { country, urls } = route.params;

    const [images, setImages] = useState([]);
    const [imagesReady, setImagesReady] = useState(false);
    const [cities, setCities] = useState([]);
    const [citiesImg, setCitiesImg] = useState([]);
    const [fontsLoaded] = useFonts({
        Merriweather_700Bold,
        OpenSans_400Regular,
        CrimsonText_400Regular,
    });

    useEffect(() => {
        setImagesReady(false);
        setCitiesImg([]);
        setCities([]);
        setImages([]);

        const getCountryImages = () => {
            const indImgs = [];
            while (indImgs.length < 4) {
                const randomIndex = Math.floor(Math.random() * urls.length);

                if (!indImgs.includes(randomIndex)) {
                    indImgs.push(randomIndex);
                }
            }
            setImages(indImgs);
        };

        const fetchData = async (country) => {
            let dataNames = [];
            try {
                dataNames = await fetchCities(country + "+all");
                setCities(dataNames);
            } catch (error) {
                console.error('Error fetching the cities\' names:', error);
            }
            try {
                const urls = await Promise.all(
                    dataNames.map(async (city) => {
                        const data = await fetchImagesUnsplash(city);
                        return data;
                    })
                );
                setCitiesImg(urls);
            } catch (error) {
                console.error('Error fetching the images:', error);
            }
        }

        const preloadImages = async (urls) => {
            const cacheImages = urls.map((url) => Image.prefetch(url));
            await Promise.all(cacheImages);
        }

        const LoadImages = async () => {
            await preloadImages(urls);
            //await preloadImages(citiesUrls);
            setImagesReady(true);
        }

        fetchData(country);
        getCountryImages();
        LoadImages();

    }, [urls])

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <View style={{ flex: 1, padding: 10 }}>
            {imagesReady ? (
                <View>
                    <BackButton></BackButton>
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                        {country ?
                            <Text style={styles.title}>{country}</Text>
                            :
                            <Text style={styles.title}>Undefined</Text>
                        }
                        <TouchableOpacity
                            style={{
                                marginLeft: 30,
                                backgroundColor: '#A0B5DB',
                                borderRadius: 25,
                                padding: 10,
                            }}
                            onPress={() => {
                                save();
                            }}
                        >
                            <Image
                                source={require('./../../assets/icons/save.png')}
                                style={{ width: 20, height: 20 }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal={false}
                        showsVerticalScrollIndicator={true}
                        contentContainerStyle={styles.scrollContainer}
                    >
                        {citiesImg.length > 0 ? (
                            cities.map((city, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.cities}
                                    onPress={() => navigation.navigate('city', {
                                        city: city,
                                        urls: citiesImg[index],
                                        country: country,
                                    })}>
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
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={styles.title}>Loading...</Text>
                        )}
                    </ScrollView>
                </View>
            ) :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontFamily: 'OpenSans_400Regular' }}>
                        Loading  
                    </Text>
                    <ActivityIndicator
                        size="large"
                        color="#A0B5DB"
                    />
                </View>
            }
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
        height: '30%',
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
        paddingBottom: '20%',
    },

});