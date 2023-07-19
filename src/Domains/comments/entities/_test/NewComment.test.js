const Comment = require('../NewComment');

describe('NewComment entities', () => {
  it('should throw an error when the required properties are missing', () => {
    const payload = {
      content: 'A sample comment',
    };
    expect(() => new Comment(payload)).toThrowError('NEW_COMMENT.MISSING_REQUIRED_PROPERTIES');
  });

  it('should throw an error when the payload does not meet the data type specification', () => {
    const payload = {
      content: true,
      threadId: 'thread-123',
      owner: 'user-abc',
    };
    expect(() => new Comment(payload)).toThrowError('NEW_COMMENT.INVALID_DATA_TYPES');
  });

  it('should create a NewComment object correctly', () => {
    const payload = {
      content: 'A sample comment',
      threadId: 'thread-123',
      owner: 'user-abc',
    };
    const { content, threadId, owner } = new Comment(payload);
    expect(content).toEqual(payload.content);
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
  });
});
