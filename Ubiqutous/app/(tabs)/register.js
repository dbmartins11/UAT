import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const router = useRouter();
  const { from } = useLocalSearchParams(); // saber de onde o utilizador veio
    const navigator = useNavigation();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const handleRegister = () => {
    // aqui vai a lógica real de registo (Firebase, validação, etc.)
    alert('Registered successfully!');
    router.replace('/(tabs)/home');
  };

  const handleGoBack = () => {
    if (from === 'index') {
      router.replace('/(tabs)/index');
    } else {
      router.replace('/(tabs)/login');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <TouchableOpacity style={styles.backIcon} onPress={()=> navigator.goBack()}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Image
          source={require('../../assets/icons/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.input} >
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.inputField}
          />
        </View>

        <View style={styles.input}>
          <TextInput
            placeholder="E-mail"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={styles.inputField}
          />
        </View>

        <View style={styles.input}>
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.inputField}
          />
        </View>

        <View style={styles.input}>
          <TextInput
            placeholder="Repeat password"
            secureTextEntry
            value={repeatPassword}
            onChangeText={setRepeatPassword}
            style={styles.inputField}
          />
        </View>

        <View style={styles.profileUploadRow}>
          <View style={styles.profileCircle}></View>
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Upload Profile Photo</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
          <Text style={styles.loginText}>Login</Text>
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
    marginTop: 100,
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  logo: {
    width: 60,
    height: 60,
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  inputField: {
    fontSize: 16,
  },
  profileUploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    justifyContent: 'space-between',
  },
  profileCircle: {
    width: 60,
    height: 60,
    backgroundColor: '#D9E8FA',
    borderRadius: 30,
  },
  uploadButton: {
    backgroundColor: 'black',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 5,
    elevation: 4,
  },
  loginButton: {
    backgroundColor: '#3A5BA0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  loginText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backIcon: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
});
