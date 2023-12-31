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
      expect(comments[0].id).toBe('comment-123');
      expect(comments[0].content).toBe(newComment.content);
      expect(comments[0].owner).toBe(newComment.owner);
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
      await commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-abc');
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

      const threadId = 'thread-123'

      const firstComment = {
        id: 'comment-123',
        content: 'A sample comment',
        date: new Date('2023-07-18T16:00:00.000Z'),
        owner: 'user-abc',
        thread_id: threadId,
      };
      const secondComment = {
        id: 'comment-456',
        content: 'Another sample comment',
        date: new Date('2023-07-19T03:00:00.000Z'),
        owner: 'user-abc',
        thread_id: threadId,
      };

      await CommentsTableTestHelper.addComment(firstComment);
      await CommentsTableTestHelper.addComment(secondComment);

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      

      commentDetails = await commentRepositoryPostgres.getCommentsByThreadId(threadId);
      
      expect(commentDetails).toHaveLength(2);
      expect(commentDetails[0].id).toEqual('comment-123');
      expect(commentDetails[0].content).toEqual('A sample comment');
      expect(commentDetails[0].date).toEqual(new Date('2023-07-18T16:00:00.000Z'));
      expect(commentDetails[0].username).toEqual('dicoding');
      expect(commentDetails[0].is_deleted).toEqual(false);
      expect(commentDetails[0].owner).toEqual('user-abc');
      expect(commentDetails[0].thread_id).toEqual(threadId);
      expect(commentDetails[1].id).toEqual('comment-456');
      expect(commentDetails[1].content).toEqual('Another sample comment');
      expect(commentDetails[1].date).toEqual(new Date('2023-07-19T03:00:00.000Z'));
      expect(commentDetails[1].username).toEqual('dicoding');
      expect(commentDetails[1].is_deleted).toEqual(false);
      expect(commentDetails[1].owner).toEqual('user-abc');
      expect(commentDetails[1].thread_id).toEqual(threadId);
    });

    it('should return an empty list when there is no comment inside a thread', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});
      const commentDetails = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');
      expect(commentDetails).toStrictEqual([]);
    });
  });

  describe('verifyAvailableCommentInsideThread function', () => {
    it('should throw NotFoundError when comment is not exist in a thread or the thread is not exist', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});
      await expect(commentRepositoryPostgres.verifyAvailableCommentInsideThread('thread-123', 'comment-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread and related comment exist', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'A sample comment',
        date: new Date('2023-07-18T16:00:00.000Z'),
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});
      await expect(commentRepositoryPostgres.verifyAvailableCommentInsideThread('comment-123', 'thread-123')).resolves.not.toThrowError(NotFoundError);
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