import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import City from '../../app/(tabs)/City';
import * as serpApi from '../../api/serpApi';
import * as unsplashApi from '../../api/apiUnsplash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '../../components/ThemeContext';

// Mocks
jest.mock('../../api/serpApi');
jest.mock('../../api/apiUnsplash');
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('user123')),
}));
jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));
jest.mock('expo-app-loading', () => 'AppLoading');
jest.mock('../../firebase/firebaseConf', () => ({
  db: {},
}));
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ forEach: fn => fn({ id: '1', data: () => ({ name: 'My List' }) }) })),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false })),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  arrayUnion: jest.fn(),
}));

describe('City Page', () => {
  const mockRoute = {
    params: {
      city: 'Paris',
      urls: ['url1', 'url2', 'url3', 'url4', 'url5'],
      country: 'France',
      prevUrls: [],
    },
  };

  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    serpApi.fetchMonuments.mockResolvedValue(['Eiffel Tower']);
    unsplashApi.fetchImagesUnsplash.mockResolvedValue(['img1', 'img2', 'img3']);
  });

  const renderWithProviders = () =>
    render(
      <ThemeProvider>
        <NavigationContainer>
          <City navigation={mockNavigation} route={mockRoute} />
        </NavigationContainer>
      </ThemeProvider>
    );

  it('renders loading initially', async () => {
    const { getByText } = renderWithProviders();
    expect(getByText(/Loading/i)).toBeTruthy();
  });

  it('opens and closes the sidebar', async () => {
    const { getByText, getAllByRole } = renderWithProviders();
    await waitFor(() => getByText('Paris'));

    const saveButtons = getAllByRole('button');
    fireEvent.press(saveButtons[0]);

    await waitFor(() => getByText('Lists'));
    expect(getByText('Lists')).toBeTruthy();
  });
});
