import { handleRegister } from '../path/to/RegisterScreen';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDocs, query, collection, where, setDoc, doc } from 'firebase/firestore';

// Firebase mocks
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  doc: jest.fn(),
}));

// Alert mock
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Alert: {
      alert: jest.fn(),
    },
  };
});

describe('handleRegister', () => {
  const mockRouter = { replace: jest.fn() };
  const setLoading = jest.fn();

  const setup = ({
    username = 'testuser',
    email = 'test@example.com',
    password = 'password123',
    repeatPassword = 'password123',
    snapshotEmpty = true,
    throwOnCreate = null,
  }) => {
    getDocs.mockResolvedValueOnce({
      empty: snapshotEmpty,
    });

    if (throwOnCreate) {
      createUserWithEmailAndPassword.mockRejectedValueOnce(throwOnCreate);
    } else {
      createUserWithEmailAndPassword.mockResolvedValueOnce({
        user: { uid: 'fakeUID' },
      });
    }

    return {
      username,
      email,
      password,
      repeatPassword,
      mockRouter,
      setLoading,
    };
  };

  it('shows alert if fields are empty', async () => {
    const { password, repeatPassword } = setup({ username: '', email: '' });
    await handleRegister('', '', password, repeatPassword, mockRouter, setLoading);
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields.');
  });

  it('shows alert if passwords do not match', async () => {
    const { username, email } = setup({ password: 'abc', repeatPassword: 'def' });
    await handleRegister(username, email, 'abc', 'def', mockRouter, setLoading);
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Passwords do not match.');
  });

  it('shows alert if email is invalid', async () => {
    const { username, password, repeatPassword } = setup({ email: 'invalidEmail' });
    await handleRegister(username, 'invalidEmail', password, repeatPassword, mockRouter, setLoading);
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Invalid email address.');
  });

  it('shows alert if username already exists', async () => {
    const { username, email, password, repeatPassword } = setup({ snapshotEmpty: false });
    await handleRegister(username, email, password, repeatPassword, mockRouter, setLoading);
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Username already taken.');
  });

  it('registers user and sets doc on success', async () => {
    const { username, email, password, repeatPassword } = setup({});
    await handleRegister(username, email, password, repeatPassword, mockRouter, setLoading);
    expect(setDoc).toHaveBeenCalledWith(expect.anything(), {
      username,
      email,
    });
    expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)/home');
  });

  it('shows alert if email already in use', async () => {
    const err = { code: 'auth/email-already-in-use' };
    const { username, email, password, repeatPassword } = setup({ throwOnCreate: err });
    await handleRegister(username, email, password, repeatPassword, mockRouter, setLoading);
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Email already in use.');
  });

  it('shows alert if password is weak', async () => {
    const err = { code: 'auth/weak-password' };
    const { username, email, password, repeatPassword } = setup({ throwOnCreate: err });
    await handleRegister(username, email, password, repeatPassword, mockRouter, setLoading);
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Password should be at least 6 characters.');
  });

  it('shows alert for unknown errors', async () => {
    const err = { code: 'unknown', message: 'Something went wrong' };
    const { username, email, password, repeatPassword } = setup({ throwOnCreate: err });
    await handleRegister(username, email, password, repeatPassword, mockRouter, setLoading);
    expect(Alert.alert).toHaveBeenCalledWith('Registration Error', 'Something went wrong');
  });
});
