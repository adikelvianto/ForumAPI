/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadTableTestHelper = {
  async addThread({
    id = 'thread-123',
    title = 'A new thread',
    body = 'The body of a new thread',
    owner = 'user-abc',
    date = new Date('2023-07-18T16:00:00.000Z'),
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, date, owner],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads');
  },
};

module.exports = ThreadTableTestHelper;