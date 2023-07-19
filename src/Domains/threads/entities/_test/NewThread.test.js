const NewThread = require('../NewThread');

describe('NewThread entities', () => {
  it('should throw an error when the required properties are missing', () => {
    // Arrange
    const payload = {
      title: 'A title',
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.MISSING_REQUIRED_PROPERTIES');
  });

  it('should throw an error when payload does not meet data type specifications', () => {
    // Arrange
    const payload = {
      title: 'A title',
      body: 123,
      owner: 'user-abc',
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.INVALID_DATA_TYPES');
  });

  it('should create NewThread entities correctly', () => {
    // Arrange
    const payload = {
      title: 'A title',
      body: 'A body',
      owner: 'user-abc',
    };

    // Action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread).toBeInstanceOf(NewThread);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread.owner).toEqual(payload.owner);
  });
});
