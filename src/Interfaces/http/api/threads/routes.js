const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandlers,
    options: {
      auth: 'forumapi_jwt',
    },
  },

  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.getThreadByIDHandler,
  },

];

module.exports = routes;