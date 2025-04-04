import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import { fetchCities } from '../../api/api';

export default function Home() {
    useEffect(() => {
        console.log('Home component mounted'); 
        const fetchData = async () => {
            try {
                fetchCities("Portugal")
            }
            catch (error) {
                console.error('Error in Home component:', error);
            };
        }
        fetchData(); 
    }, []);

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
        </View>
    );
}

const styles = StyleSheet.create({
    homeImage: {
        height: '47%',
        width: '100%',
        textAlign: 'left',
        fontFamily: 'PatuaOne',
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
        bottom: '15%',
        width: '100%',
        paddingLeft: 20,
    }
});
