import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { useNavigation } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useTheme } from './ThemeContext';


export default function BackButton({ style, onPress }) {
    const navigation = useNavigation();
    const { darkMode } = useTheme();

    return (
        <TouchableOpacity
            onPress={onPress ? onPress : () => navigation.goBack()}
            style={styles.button}>
            <Image
                source={darkMode 
                    ? require('../assets/icons/BackButton_white.png') 
                    : require('../assets/icons/BackButton.png')}
                style={[styles.icon, style]}
                resizeMode="contain"
            />
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    button: {
        alignSelf: 'flex-start',
        backgroundColor: 'transparent',
        padding: 5,
        borderRadius: 5,
        marginVertical: 10,
    },
    icon: {
        padding: 5,
        width: 18,
        height: 18,
    },
});
