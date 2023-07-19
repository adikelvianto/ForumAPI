const ThreadHandlers = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'threads',
  register: async (server, { container }) => {
    const threadHandlers = new ThreadHandlers(container);
    server.route(routes(threadHandlers));
  },
};