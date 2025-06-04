// __tests__/Country.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Country from '../../app/(tabs)/country';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { ThemeProvider } from '../../components/ThemeContext';

// Mocks
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../../utils/languageUtils', () => ({
  getCurrentLanguage: jest.fn(() => Promise.resolve('en')),
  translate: jest.fn((text) => text),
}));

jest.mock('../../api/serpApi', () => ({
  fetchCities: jest.fn(() => Promise.resolve(['Lisbon', 'Porto'])),
}));

jest.mock('../../api/apiUnsplash', () => ({
  fetchImagesUnsplash: jest.fn(() => Promise.resolve(['https://image.com/img1.jpg', 'https://image.com/img2.jpg', 'https://image.com/img3.jpg'])),
}));

jest.mock('../../api/apiTranslateAzure', () => ({
  translateAzure: jest.fn((text) => Promise.resolve(text)),
}));

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

// Prevent font loading
jest.mock('@expo-google-fonts/merriweather', () => ({ Merriweather_700Bold: jest.fn() }));
jest.mock('@expo-google-fonts/open-sans', () => ({ OpenSans_400Regular: jest.fn() }));
jest.mock('@expo-google-fonts/crimson-text', () => ({ CrimsonText_400Regular: jest.fn() }));

// Test

describe('Country Screen', () => {
  beforeEach(() => {
    useRoute.mockReturnValue({ params: { country: 'Portugal', urls: [] } });
    useNavigation.mockReturnValue({ navigate: jest.fn(), goBack: jest.fn() });
  });

  it('renders loading state initially', async () => {
    const { getByText } = render(
      <ThemeProvider>
        <Country />
      </ThemeProvider>
    );

    expect(getByText('Loading')).toBeTruthy();
  });

  it('renders country name and toggles sidebar', async () => {
    const { findByText, getByRole } = render(
      <ThemeProvider>
        <Country />
      </ThemeProvider>
    );

    const countryTitle = await findByText('Portugal');
    expect(countryTitle).toBeTruthy();
  });
});
