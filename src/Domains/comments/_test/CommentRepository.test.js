const CommentRepository = require('../CommentRepository');

describe('CommentRepository interface', () => {
  it('should throw an error when calling an abstract behavior', async () => {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action and Assert
    await expect(commentRepository.addComment({})).rejects.toThrowError('COMMENT_REPOSITORY.ADD_METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.verifyCommentOwner('', '')).rejects.toThrowError('COMMENT_REPOSITORY.VERIFY_METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.deleteCommentById('')).rejects.toThrowError('COMMENT_REPOSITORY.DELETE_METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.verifyAvailableCommentInsideThread('')).rejects.toThrowError('COMMENT_REPOSITORY.VERIFY_INSIDE_THREAD_METHOD_NOT_IMPLEMENTED');
  });
});
