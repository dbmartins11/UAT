import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, ScrollView } from 'react-native';
import { useFonts, Merriweather_700Bold } from '@expo-google-fonts/merriweather';
import { OpenSans_400Regular } from '@expo-google-fonts/open-sans';
import { CrimsonText_400Regular } from '@expo-google-fonts/crimson-text';
import AppLoading from 'expo-app-loading';
import { useRoute } from '@react-navigation/native';

export default function Country() {
    const route = useRoute();
    const { country, urls } = route.params;

    const [searchText, setSearchText] = useState('');
    const [images, setImages] = useState([]);
    const [fontsLoaded] = useFonts({
        Merriweather_700Bold,
        OpenSans_400Regular,
        CrimsonText_400Regular,
    });

    useEffect(() => {
        console.log("adasdasdasdasd: " + urls[0]);
        const _images = [];
        while(_images.length < 4) {
            const randomIndex = Math.floor(Math.random() * urls.length);
            if(!_images.includes(randomIndex)){
                _images.push(randomIndex);
            }
        }
        setImages(_images);
    }, []);

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', padding: 10, paddingVertical: 50 }}>
            <View style={styles.imgBlock}>
                {urls[images[0]] && (
                    <Image
                        source={{ uri: urls[0] }}
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
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        marginTop: '5%',
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
        height: '100%',
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
        borderRadius: 10,
    },
    secondImg: {
        width: '100%',
        height: '50%',
        borderRadius: 10,
    },
    thirdImg: {
        width: '50%',
        height: '100%',
        borderRadius: 10,
    },
});