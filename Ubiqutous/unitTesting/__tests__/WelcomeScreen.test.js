import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WelcomeScreen from '../app/(tabs)/WelcomeScreen';
import { useRouter } from 'expo-router';

// Mock do router para verificar chamadas
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('WelcomeScreen', () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({
      replace: mockReplace,
    });
    mockReplace.mockClear();
  });

  it('renders the logo, welcome text and buttons', () => {
    const { getByText, getByRole } = render(<WelcomeScreen />);

    expect(getByText('Welcome')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
  });

  it('navigates to login when Login button is pressed', () => {
    const { getByText } = render(<WelcomeScreen />);
    fireEvent.press(getByText('Login'));
    expect(mockReplace).toHaveBeenCalledWith('/(tabs)/login');
  });

  it('navigates to register when Register button is pressed', () => {
    const { getByText } = render(<WelcomeScreen />);
    fireEvent.press(getByText('Register'));
    expect(mockReplace).toHaveBeenCalledWith('/(tabs)/register');
  });
});
