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
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { auth, db, storage } from '../../firebase/firebaseConf';
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
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setRepeatPassword('');
        setImage(null);
        setShowPassword(false);
        setShowRepeatPassword(false);
      };
    }, [])
  );

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

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

      let photoURL = '';

      // Handle image upload first (if image is selected)
      if (image) {
        try {
          const response = await fetch(image);
          const blob = await response.blob();
          const tempUid = `${Date.now()}-${username}`; // temporary ref in case Auth fails
          const storageRef = ref(storage, `profilePhotos/${tempUid}.jpg`);
          await uploadBytes(storageRef, blob);
          photoURL = await getDownloadURL(storageRef);
        } catch (uploadErr) {
          setLoading(false);
          Alert.alert('Error', 'Failed to upload image.');
          return;
        }
      }

      // Now create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Save to Firestore
      await setDoc(doc(db, 'users', uid), {
        username,
        email,
        photoURL,
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
      <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
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

        <View style={styles.profileUploadRow}>
          <View style={styles.profileCircle}>
            {image && (
              <Image source={{ uri: image }} style={{ width: 60, height: 60, borderRadius: 30 }} />
            )}
          </View>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Upload Profile Photo</Text>
          </TouchableOpacity>
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
    overflow: 'hidden',
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
