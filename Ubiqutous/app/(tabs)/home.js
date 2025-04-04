import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image} from 'react-native';

export default function Home() {
    return (
        <View style={styles.homeImage}>
            <ImageBackground
                source={require('../../assets/images/HomePicture.png')}
                style={styles.imageBackground}>
                <Text>Plan your Next </Text>
                <Text>Vacation</Text>
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
        textAlign:'left',
        fontFamily: 'PatuaOne',
        fontSize: 100,
    },
    icon: {
        width: '20%',
        height:'20%',
        left: '40%',
        bottom: '35%',
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
    },
});
