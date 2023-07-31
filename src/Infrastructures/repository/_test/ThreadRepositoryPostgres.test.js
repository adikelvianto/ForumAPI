const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');

describe('ThreadRepositoryPostgres', () => {

  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UserTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {

    it('should persist a new thread and return the added thread correctly', async () => {
      // Arrange
      await UserTableTestHelper.addUser({
        username: 'dicoding',
        password: 'supersecretpassword',
      });

      const newThread = new NewThread({
        title: 'A new thread',
        body: 'The body of a new thread',
        owner: 'user-abc',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const thread = await ThreadTableTestHelper.GetThreadsByID('thread-123');
      await expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: addedThread.title,
          owner: addedThread.owner,
        }),
      );
      expect(thread).toHaveLength(1);
    });

    it('should return the added thread correctly', async () => {
      // Arrange
      await UserTableTestHelper.addUser({
        username: 'dicoding',
        password: 'supersecretpassword',
      });

      const newThreadPayload = {
        title: 'A new thread',
        body: 'The body of a new thread',
        owner: 'user-abc',
      };
      const newThread = new NewThread(newThreadPayload);

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: 'A new thread',
          owner: 'user-abc',
        }),
      );
    });
  });

  describe('verifyAvailableThread function', () => {

    it('should throw NotFoundError when the thread is not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-1')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when the thread is found', async () => {
      // Arrange
      await UserTableTestHelper.addUser({
        username: 'dicoding',
        password: 'supersecretpassword',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadTableTestHelper.addThread({ id: 'thread-123' });

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById function', () => {

    it('should throw NotFoundError when requested thread is not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-555')).rejects.toThrowError(NotFoundError);
    });

    it('should return requested thread correctly', async () => {
      // Arrange
      await UserTableTestHelper.addUser({
        username: 'dicoding',
        password: 'supersecretpassword',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
      });

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(thread).toStrictEqual({
        id: 'thread-123',
        title: 'A new thread',
        body: 'The body of a new thread',
        date: new Date('2023-07-18T16:00:00.000Z'),
        username: 'dicoding',
      });
    });
  });

});
