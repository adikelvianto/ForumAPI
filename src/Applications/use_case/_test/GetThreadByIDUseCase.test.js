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
 
    const threadRepositoryTest = {};
    const commentRepositoryTest = {};
    threadRepositoryTest.getThreadById = jest.fn(() => ({
      id: 'thread-123',
      title: 'A new thread',
      body: 'The body of a new thread',
      date: '2023-07-18T16:00:00.000Z',
      username: 'dicoding',
    }));
  
    commentRepositoryTest.getCommentsByThreadId = jest.fn(() => [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2023-07-18T16:00:00.000Z',
        content: 'A sample comment',
        is_deleted: false,
        owner: 'user-abc',
        thread_id: 'thread-123',
      },
    ]);

    const GetThreadByIDUseCaseTest = new GetThreadByIDUseCase({
      commentRepository: commentRepositoryTest,
      threadRepository: threadRepositoryTest,
    });
    
    // Action
    const thread = await GetThreadByIDUseCaseTest.execute(useCasePayload.threadId);

    // Assert
    expect(thread).toStrictEqual({
      ...expectedThread,
      comments: expectedCommentsMapped,
    });
    expect(threadRepositoryTest.getThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(commentRepositoryTest.getCommentsByThreadId).toBeCalledWith(useCasePayload.threadId);
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
 
    const threadRepositoryTest = {};
    const commentRepositoryTest = {};

    threadRepositoryTest.getThreadById = jest.fn(() => ({
      id: 'thread-123',
      title: 'A new thread',
      body: 'The body of a new thread',
      date: '2023-07-18T16:00:00.000Z',
      username: 'dicoding',
    }));
  
    commentRepositoryTest.getCommentsByThreadId = jest.fn(() => [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2023-07-18T16:00:00.000Z',
        is_deleted: true,
        owner: 'user-abc',
        thread_id: 'thread-123',
      },
    ]);
    
    const GetThreadByIDUseCaseTest = new GetThreadByIDUseCase({
      commentRepository: commentRepositoryTest,
      threadRepository: threadRepositoryTest,
    });
    
    // Action
    const thread = await GetThreadByIDUseCaseTest.execute(useCasePayload.threadId);

    // Assert
    expect()
    expect(thread).toStrictEqual({
      ...expectedThread,
      comments: expectedCommentsMapped,
    });
    expect(threadRepositoryTest.getThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(commentRepositoryTest.getCommentsByThreadId).toBeCalledWith(useCasePayload.threadId);
  });
});