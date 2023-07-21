const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');

describe('CommentRepositoryPostgres', () => {

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-abc', username: 'dicoding' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-abc' });
  });
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should add correct comment and owner to the database', async () => {
      // arrange
      const newComment = new NewComment({
        content: 'A sample comment',
        threadId: 'thread-123',
        owner: 'user-abc',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      // action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);
      const comments = await CommentsTableTestHelper.getCommentById(addedComment.id);
      // assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: newComment.content,
        owner: newComment.owner,
      }));
      expect(comments).toHaveLength(1);
    });

    it('should return the added comment correctly', async () => {
      // arrange
      const newComment = new NewComment({
        content: 'A sample comment',
        threadId: 'thread-123',
        owner: 'user-abc',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      // action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);
      // assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: newComment.content,
        owner: newComment.owner,
      }));
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should return true if the comment owner is identical to the payload owner', async () => {
      const newComment = new NewComment({
        content: 'A sample comment',
        threadId: 'thread-123',
        owner: 'user-abc',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await commentRepositoryPostgres.addComment(newComment);
      const isCommentOwner = await commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-abc');
      expect(isCommentOwner).toStrictEqual(1);
    });
    
    it('should return Authorization error when founded difference between comment owner', async () => {
      const newComment = new NewComment({
        content: 'A sample comment',
        threadId: 'thread-123',
        owner: 'user-abc',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await commentRepositoryPostgres.addComment(newComment);
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-def')).rejects.toThrowError(AuthorizationError);
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should return all comments from related thread', async () => {
      const firstComment = {
        id: 'comment-123',
        content: 'A sample comment',
        date: new Date('2023-07-18T16:00:00.000Z'),
      };
      const secondComment = {
        id: 'comment-456',
        content: 'Another sample comment',
        date: new Date('2023-07-19T03:00:00.000Z'),
      };
      await CommentsTableTestHelper.addComment(firstComment);
      await CommentsTableTestHelper.addComment(secondComment);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      let commentDetails = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');
      commentDetails = commentDetails.map((comment) => ({
        id: comment.id,
        content: comment.content,
        date: comment.date,
        username: comment.username,
      }));

      expect(commentDetails).toEqual([
        { ...firstComment, username: 'dicoding' },
        { ...secondComment, username: 'dicoding' },
      ]);
    });

    it('should return an empty list when there is no comment inside a thread', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});
      const commentDetails = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');
      expect(commentDetails).toStrictEqual([]);
    });
  });

  describe('verifyAvailableCommentInThread function', () => {
    it('should throw NotFoundError when comment is not exist in a thread or the thread is not exist', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});
      await expect(commentRepositoryPostgres.verifyAvailableCommentInThread('thread-123', 'comment-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread and related comment exist', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'A sample comment',
        date: new Date('2023-07-18T16:00:00.000Z'),
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});
      await expect(commentRepositoryPostgres.verifyAvailableCommentInThread('comment-123', 'thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should throw NotFoundError when comment is not exist', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});
      await expect(commentRepositoryPostgres.deleteCommentById('comment-123')).rejects.toThrowError(NotFoundError);
    });

    it('should delete specific comment by the id correctly', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'A sample comment',
        date: new Date('2023-07-18T16:00:00.000Z'),
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});
      await commentRepositoryPostgres.deleteCommentById('comment-123');
      const comment = await CommentsTableTestHelper.getCommentById('comment-123');
      expect(comment[0].is_deleted).toBe(true);
    });
  });

});