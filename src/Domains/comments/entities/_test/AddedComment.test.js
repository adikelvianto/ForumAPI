const AddedComment = require('../AddedComment');

describe('AddedComment entities', () => {

  it('should throw an error when the required properties are missing', () => {
    const payload = {
      id: 'comment-123',
      content: 'A sample comment',
    };
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.MISSING_REQUIRED_PROPERTIES');
  });

  it('should throw an error when the payload does not meet the data type specification', () => {
    const payload = {
      id: 'comment-123',
      content: true,
      owner: 'user-abc',
    };
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.INVALID_DATA_TYPES');
  });

  it('should create the AddedComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'A sample comment',
      owner: 'user-abc',
    };
    const { id, content, owner } = new AddedComment(payload);
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });

});
