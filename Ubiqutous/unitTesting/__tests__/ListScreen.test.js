import { handleToggleCountryVisited, handleDeleteList } from '../path/to/ListScreen';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  deleteDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

describe('ListScreen logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete list from Firestore', async () => {
    const navigationMock = { goBack: jest.fn() };
    const userID = 'testUser';
    const listName = 'testList';

    // Simula o contexto
    const listRef = {};
    doc.mockReturnValue(listRef);

    // Executa
    await handleDeleteList(userID, listName, navigationMock);

    // Verifica
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', userID, 'lists', listName);
    expect(deleteDoc).toHaveBeenCalledWith(listRef);
    expect(navigationMock.goBack).toHaveBeenCalled();
  });

  it('should toggle country visited state and update Firestore', async () => {
    const userID = 'user1';
    const listName = 'listA';
    const listContent = {
      countries: {
        Portugal: { visited: false, cities: {} }
      }
    };
    const setListContent = jest.fn();
    const fetchListData = jest.fn();

    const listRef = {};
    doc.mockReturnValue(listRef);

    await handleToggleCountryVisited(userID, listName, listContent, 'Portugal', fetchListData);

    expect(updateDoc).toHaveBeenCalledWith(listRef, {
      countries: {
        Portugal: { visited: true, cities: {} }
      }
    });
    expect(fetchListData).toHaveBeenCalled();
  });
});
