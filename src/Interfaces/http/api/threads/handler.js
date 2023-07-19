const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadHandlers {
  constructor(container) {
    this._container = container;
    this.postThreadHandlers = this.postThreadHandlers.bind(this);
  }

  async postThreadHandlers({ payload, auth }, h) {
    const usecasePayload = {
      title: payload.title,
      body: payload.body,
      owner: auth.credentials.id,
    };

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(usecasePayload);

    const response = h.response({
      status: 'success',
      message: 'Thread berhasil ditambahkan',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadHandlers;