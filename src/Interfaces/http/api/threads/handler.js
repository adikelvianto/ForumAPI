const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadByIDUseCase = require('../../../../Applications/use_case/GetThreadByIDUseCase');

class ThreadHandlers {
  constructor(container) {
    this._container = container;
    this.postThreadHandlers = this.postThreadHandlers.bind(this);
    this.getThreadByIDHandler = this.getThreadByIDHandler.bind(this);
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

  async getThreadByIDHandler(request) {
    const getThreadByIDUseCase = this._container.getInstance(GetThreadByIDUseCase.name);
    const thread = await getThreadByIDUseCase.execute(request.params.threadId);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadHandlers;