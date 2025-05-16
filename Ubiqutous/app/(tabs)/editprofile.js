import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth, db } from '../../firebase/firebaseConf';
import {
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

export default function EditProfileScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [originalData, setOriginalData] = useState({ username: '', email: '', aboutMe: '' });

  useFocusEffect(
    useCallback(() => {
      return () => {
        // Reverter dados se sair sem guardar
        setUsername(originalData.username);
        setEmail(originalData.email);
        setAboutMe(originalData.aboutMe);
        setCurrentPassword('');
        setNewPassword('');
        setShowPassword(false);
        setShowCurrentPassword(false);
      };
    }, [originalData])
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        await user.reload();
        const updatedUser = auth.currentUser;
        const docSnap = await getDoc(doc(db, 'users', updatedUser.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          const current = {
            username: data.username || '',
            email: data.email || updatedUser.email,
            aboutMe: data.aboutMe || '',
          };
          setUsername(current.username);
          setEmail(current.email);
          setAboutMe(current.aboutMe);
          setOriginalData(current);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const changingSensitiveData = email !== user.email || newPassword.length > 0;
      if (changingSensitiveData && currentPassword.length === 0) {
        Alert.alert('Authentication required', 'Enter current password to confirm changes.');
        return;
      }

      if (currentPassword.length > 0) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
      }

      if (!user.emailVerified && email !== user.email) {
        Alert.alert(
          'Email not verified',
          'Please verify your current email before changing it.',
          [
            {
              text: 'Send verification',
              onPress: async () => {
                await user.sendEmailVerification();
                Alert.alert('Verification email sent!');
              },
            },
            { text: 'OK' },
          ]
        );
        return;
      }

      if (email !== user.email) {
        await updateEmail(user, email);
      }

      if (newPassword.length > 0) {
        if (newPassword.length < 6) {
          Alert.alert('Weak password', 'New password must be at least 6 characters.');
          return;
        }
        await updatePassword(user, newPassword);
      }

      await updateDoc(doc(db, 'users', user.uid), {
        username,
        email,
        aboutMe,
      });

      Alert.alert('Success', 'Profile updated successfully!');
      router.replace('/profile');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={80}
      />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backIcon} onPress={() => router.replace('/profile')}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>Edit Profile</Text>

        <TextInput
          style={styles.input}
          placeholder="Novo username"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Novo email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="About me..."
          multiline
          value={aboutMe}
          onChangeText={setAboutMe}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Current password (required)"
            secureTextEntry={!showCurrentPassword}
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
            <Ionicons
              name={showCurrentPassword ? 'eye-off' : 'eye'}
              size={20}
              color="gray"
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="New password (optional)"
            secureTextEntry={!showPassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="gray"
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
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
    padding: 20,
    paddingTop: 80,
  },
  backIcon: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#3A5BA0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
