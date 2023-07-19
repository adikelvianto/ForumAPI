const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should respond with 401 when the request is missing authentication', async () => {
      // Arrange
      const requestPayload = {
        title: 'A new thread',
        body: 'The body of a new thread',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should respond with 400 when the request payload does not contain the needed property', async () => {
      // Arrange
      const requestPayload = {
        body: 'The body of a new thread',
      };
      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread baru tidak dapat dibuat karena property yang dibutuhkan tidak lengkap');
    });

    it('should respond with 400 when the request payload does not meet the data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 'A new thread',
        body: 333,
      };
      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread baru tidak dapat dibuat karena tipe data yang dilampirkan tidak sesuai');
    });

    it('should respond with 201 and the persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'A new thread',
        body: 'The body of a new thread',
      };
      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });
  });
});
