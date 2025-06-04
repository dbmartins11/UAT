import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../app/(tabs)/login';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConf';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock useRouter
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}));

// Mock auth.currentUser
jest.mock('../firebase/firebaseConf', () => ({
  auth: {
    currentUser: {
      uid: 'mocked-uid',
    },
  },
}));

describe('LoginScreen', () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ replace: mockReplace });
    mockReplace.mockClear();
  });

  it('renders all fields and buttons', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('Create one')).toBeTruthy();
  });

  it('navigates to register when clicking "Create one"', () => {
    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText('Create one'));
    expect(mockReplace).toHaveBeenCalledWith('/(tabs)/register');
  });

  it('performs login when credentials are valid', async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce(); // simula sucesso

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'user@test.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'user@test.com', 'password123');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('userID', 'mocked-uid');
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)/home');
    });
  });

  it('shows alert when login fails', async () => {
    const alertMock = jest.spyOn(global, 'alert').mockImplementation(() => {});
    signInWithEmailAndPassword.mockRejectedValueOnce(new Error('Invalid credentials'));

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'fail@test.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpass');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Login failed: Invalid credentials');
    });

    alertMock.mockRestore();
  });
});

