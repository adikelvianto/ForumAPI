const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadByIDUseCase = require('../GetThreadByIDUseCase');

describe('GetThreadByIDUseCase', () => {
  it('should correctly orchestrate the add thread action', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const expectedThread = {
      id: 'thread-123',
      title: 'A new thread',
      body: 'The body of a new thread',
      date: '2023-07-18T16:00:00.000Z',
      username: 'dicoding',
    };

    const expectedComments = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2023-07-18T16:00:00.000Z',
        content: 'A sample comment',
        is_deleted: false,
      },
    ];

    const comments = expectedComments.map(({ is_deleted: deletedComment, ...otherProperties }) => otherProperties);

    const expectedCommentsMapped = [
      {
        ...comments[0],
      },
    ];

    // Create required mock
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockImplementation(() => Promise.resolve(expectedComments));

    const mockGetThreadByIDUseCase = new GetThreadByIDUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const thread = await mockGetThreadByIDUseCase.execute(useCasePayload.threadId);

    // Assert
    expect(thread).toStrictEqual({
      ...expectedThread,
      comments: expectedCommentsMapped,
    });
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.threadId);
  });

  it('should display deleted comment as **komentar telah dihapus**', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const expectedThread = {
      id: 'thread-123',
      title: 'A new thread',
      body: 'The body of a new thread',
      date: '2023-07-18T16:00:00.000Z',
      username: 'dicoding',
    };

    const expectedComments = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2023-07-18T16:00:00.000Z',
        content: '**komentar telah dihapus**',
        is_deleted: true,
      },
    ];

    const comments = expectedComments.map(({ is_deleted: deletedComment, ...otherProperties }) => otherProperties);

    const expectedCommentsMapped = [
      {
        ...comments[0],
      },
    ];

    // Create required mock
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockImplementation(() => Promise.resolve(expectedComments));

    const mockGetThreadByIDUseCase = new GetThreadByIDUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const thread = await mockGetThreadByIDUseCase.execute(useCasePayload.threadId);

    // Assert
    expect(thread).toStrictEqual({
      ...expectedThread,
      comments: expectedCommentsMapped,
    });
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.threadId);
  });
});