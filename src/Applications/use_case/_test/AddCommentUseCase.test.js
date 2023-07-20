const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should correctly orchestrate the add thread action', async () => {
    // Arrange
    const useCasePayload = {
      content: 'A sample comment',
      threadId: 'thread-123',
      owner: 'user-abc',
    };

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      date: '2023-07-18T16:00:00.000Z',
      owner: useCasePayload.owner,
    });

    // Create dependencies for the use case
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // Mock required functions
    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(
      new AddedComment({
        id: 'comment-123',
        content: useCasePayload.content,
        threadId: useCasePayload.threadId,
        date: '2023-07-18T16:00:00.000Z',
        owner: useCasePayload.owner,
      }),
    ));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(
      new NewComment({
        content: useCasePayload.content,
        threadId: useCasePayload.threadId,
        owner: useCasePayload.owner,
      }),
    );
  });
});
