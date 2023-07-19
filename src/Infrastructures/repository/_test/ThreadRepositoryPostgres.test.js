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
      await expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: 'A new thread',
          owner: 'user-abc',
        }),
      );
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
});
