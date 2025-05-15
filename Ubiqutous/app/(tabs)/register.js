import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConf';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function RegisterScreen() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setRepeatPassword('');
        setShowPassword(false);
        setShowRepeatPassword(false);
      };
    }, [])
  );

  const handleRegister = async () => {
    if (!username || !email || !password || !repeatPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password !== repeatPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Invalid email address.');
      return;
    }

    setLoading(true);

    try {
      const q = query(collection(db, 'users'), where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setLoading(false);
        Alert.alert('Error', 'Username already taken.');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        username,
        email,
      });

      setLoading(false);
      router.replace('/(tabs)/home');
    } catch (error) {
      setLoading(false);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'Email already in use.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Error', 'Password should be at least 6 characters.');
      } else {
        Alert.alert('Registration Error', error.message);
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <TouchableOpacity style={styles.backIcon} onPress={() => router.replace('/')}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Image
          source={require('../../assets/icons/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.input}>
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
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={styles.inputField}
          />
        </View>

        <View style={styles.input}>
          <View style={styles.passwordRow}>
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              style={[styles.inputField, { flex: 1 }]}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="gray" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.input}>
          <View style={styles.passwordRow}>
            <TextInput
              placeholder="Repeat password"
              secureTextEntry={!showRepeatPassword}
              value={repeatPassword}
              onChangeText={setRepeatPassword}
              style={[styles.inputField, { flex: 1 }]}
            />
            <TouchableOpacity onPress={() => setShowRepeatPassword(!showRepeatPassword)}>
              <Ionicons name={showRepeatPassword ? 'eye-off' : 'eye'} size={20} color="gray" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Register</Text>
          )}
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
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
