import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useFonts, Merriweather_700Bold } from '@expo-google-fonts/merriweather';
import { OpenSans_400Regular } from '@expo-google-fonts/open-sans';
import { CrimsonText_400Regular } from '@expo-google-fonts/crimson-text';
import AppLoading from 'expo-app-loading';
import { useRoute } from '@react-navigation/native';
import { fetchMonuments, fetchImagesUnsplash } from '../../api/api.js';
import { useNavigation } from 'expo-router';
import BackButton from '../../components/backButton.js';

export default function City() {
    const navigation = useNavigation();
    const route = useRoute();
    const { city, urls } = route.params;

    const [images, setImages] = useState([]);
    const [monuments, setMonuments] = useState([]);
    const [monumentsImg, setMonumentsImg] = useState([]);
    const [fontsLoaded] = useFonts({
        Merriweather_700Bold,
        OpenSans_400Regular,
        CrimsonText_400Regular,
    });

    useEffect(() => {
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

        const fetchData = async (city) => {
            let dataNames = [];
            try {
                dataNames = await fetchMonuments(`${city}`);
                setMonuments(dataNames);
            } catch (error) {
                console.error('Error fetching the cities\' names:', error);
            }
            try {
                const urls = await Promise.all(
                    dataNames.map(async (monument) => {
                        const data = await fetchImagesUnsplash(monument);
                        return data;
                    })
                );
                setMonumentsImg(urls);
            } catch (error) {
                console.error('Error fetching the images:', error);
            }
        }

        fetchData(city);

        if (urls || urls.length !== 0) {
            getCountryImages();
        }

    }, [urls])

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <BackButton />
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
            {city ?
                <Text style={styles.title}>{city}</Text>
                :
                <Text style={styles.title}>Undefined</Text>
            }
            <ScrollView
                horizontal={false}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={styles.scrollContainer}
            >
                {monumentsImg.length > 0 ? (
                    monuments.map((monument, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.monuments}
                            onPress={() => navigation.navigate('monument', {
                                monument: monument,
                                city: city,
                                url: monumentsImg[index],
                            })}
                        >
                            <View style={{ width: '30%', justifyContent: 'center' }}>
                                <Text style={{
                                    fontFamily: 'OpenSans_400Regular',
                                    fontSize: 17,
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                }}>
                                    {monument}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', width: '70%', marginHorizontal: 'auto' }}>
                                <Image
                                    source={{ uri: monumentsImg[index][0] }}
                                    style={styles.cityImg}>
                                </Image>
                                <Image
                                    source={{ uri: monumentsImg[index][1] }}
                                    style={styles.cityImg}>
                                </Image>
                                <Image
                                    source={{ uri: monumentsImg[index][2] }}
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
    monuments: {
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