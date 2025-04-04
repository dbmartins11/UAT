import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
        <ImageBackground
            source={require('../../assets/images/background.png')}
            style={styles.background}
            resizeMode="cover"
        >
        <View style={styles.container}>
        <Image
          source={require('../../assets/icons/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.subtitle}>Welcome</Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.replace('/(tabs)/login')}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.replace('/(tabs)/register')}
        >
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(205, 224, 245, 0.6)',
  },
  logo: {
    width: 220,  // ← maior
    height: 220,
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 32,  // ← maior e mais central
    marginBottom: 40,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#3A5BA0',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 12,
    width: '70%',
    alignItems: 'center',

    // Drop shadow (iOS e Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#111',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '70%',
    alignItems: 'center',

    // Drop shadow (iOS e Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  registerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
