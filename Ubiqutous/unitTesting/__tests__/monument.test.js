// __tests__/monument.test.js
import { createList } from '../path/to/monument';
import { setDoc, doc, getDoc } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  collection: jest.fn(),
}));

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

describe('createList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not create list if listName is empty', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await createList('', 'user123', 'Country', 'City', 'Monument');
    expect(consoleSpy).toHaveBeenCalledWith("List name is empty, not creating list.");
  });

  it('should alert if list already exists', async () => {
    getDoc.mockResolvedValueOnce({ exists: () => true });
    await createList('MyList', 'user123', 'Country', 'City', 'Monument');
    expect(getDoc).toHaveBeenCalled();
  });

  it('should call setDoc if list does not exist', async () => {
    getDoc.mockResolvedValueOnce({ exists: () => false });
    await createList('NewList', 'user123', 'Country', 'City', 'Monument');
    expect(setDoc).toHaveBeenCalled();
  });
});
