const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandlers,
    options: {
      auth: 'forumapi_jwt',
    },
  },
];

module.exports = routes;