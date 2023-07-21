const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('/comments endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should respond with 201 and the persisted thread', async () => {
      // arrange
      const requestPayload = {
        content: 'A sample comment',
      };
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });
      const threadId = 'thread-123';

      await ThreadTableTestHelper.addThread({ id: threadId, owner: userId });

      // action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
    });

    it('should respond with 400 when request payload does not contain the needed property', async () => {
      // arrange
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });
      const threadId = 'thread-123';

      await ThreadTableTestHelper.addThread({ id: threadId, owner: userId });

      // action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should respond with 400 when request payload does not meet the data type specification', async () => {
      // arrange
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });
      const threadId = 'thread-123';

      await ThreadTableTestHelper.addThread({ id: threadId, owner: userId });

      // action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 123,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai',
      );
    });

    it('should respond with 401 when request did not contain access token', async () => {
      // arrange
      const server = await createServer(container);
      const { userId } = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });
      const threadId = 'thread-123';

      await ThreadTableTestHelper.addThread({ id: threadId, owner: userId });

      // action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'A sample comment',
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when thread is not found', async () => {
      // arrange
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });
      const threadId = 'thread-123';

      await ThreadTableTestHelper.addThread({ id: threadId, owner: userId });

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/xyz/comments',
        payload: {
          content: 'A sample comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread not found');
      });

  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should respond with 200 and delete related comment', async () => {
      // arrange
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await ThreadTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      // action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should respond with 401 when request did not contain access token', async () => {
      // arrange
      const server = await createServer(container);
      const { userId } = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await ThreadTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      // action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });
    
    it('should respond with 403 when user is not owner', async () => {
      // arrange
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const userId_other = 'user-def';

      await ThreadTableTestHelper.addThread({ id: threadId, owner: userId });
      await UsersTableTestHelper.addUser({ id: userId_other });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId_other });

      // action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda tidak berhak mengakses resource ini');
    });

    it('should respond with 404 when thread is not found', async () => {
      // arrange
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await ThreadTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      // action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/thread-456/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Komentar pada thread ini tidak dapat ditemukan');
    });
  });
});