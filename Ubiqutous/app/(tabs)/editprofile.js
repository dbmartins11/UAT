import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth, db } from '../../firebase/firebaseConf';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { ScrollView } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


import {
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';

export default function EditProfileScreen() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  useFocusEffect(
  useCallback(() => {
    return () => {
      setCurrentPassword('');
      setNewPassword('');
      setShowPassword(false);
      setShowCurrentPassword(false);
    };
  }, [])
);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsername(data.username || '');
        setEmail(data.email || user.email);
        setAboutMe(data.aboutMe || '');
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // ⚠️ Se vai alterar email ou password, tem de reautenticar com password atual
      if ((email !== user.email || newPassword.length > 0) && currentPassword.length === 0) {
        Alert.alert('Erro', 'Enter your current password to confirm sensitive changes.');
        return;
      }

      if (currentPassword.length > 0) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
      }

      // Alterar email se necessário
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      // Alterar password se necessário
      if (newPassword.length > 0) {
        if (newPassword.length < 6) {
          Alert.alert('Erro', 'A nova password deve ter pelo menos 6 caracteres.');
          return;
        }
        await updatePassword(user, newPassword);
      }

      // Guardar dados no Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        username,
        email,
        aboutMe,
      });

      Alert.alert('Profile updated successfully!');
      router.replace('/profile');
    } catch (error) {
      console.error(error);
      Alert.alert('Error updating profile', error.message);
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
          keyboardVerticalOffset={80} // Ajustável
      ></KeyboardAvoidingView>

      <ScrollView contentContainerStyle={styles.container}  keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.replace('/profile')}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>Editar Perfil</Text>

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

        {/* 🔑 Password atual */}
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

        {/* 🔒 Nova password */}
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
          <Text style={styles.saveButtonText}>Guardar Alterações</Text>
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
