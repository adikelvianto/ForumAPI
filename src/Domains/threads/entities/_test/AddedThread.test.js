const AddedThread = require('../AddedThread');

describe('AddedThread entities', () => {
  it('should throw an error when the required properties are missing', () => {
    // Arrange
    const payload = {
      title: 'A title',
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.MISSING_REQUIRED_PROPERTIES');
  });

  it('should throw an error when payload does not meet data type specifications', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 123,
      owner: 'user-abc',
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.INVALID_DATA_TYPES');
  });

  it('should create AddedThread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'A title',
      owner: 'user-abc',
    };

    // Action
    const addedThread = new AddedThread(payload);

    // Assert
    expect(addedThread).toBeInstanceOf(AddedThread);
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });

});
