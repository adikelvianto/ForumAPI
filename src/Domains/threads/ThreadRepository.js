class ThreadRepository {
  async addThread(newThread) {
    throw new Error('THREAD_REPOSITORY.ADD_METHOD_NOT_IMPLEMENTED');
  }
  
  async verifyAvailableThread(threadId) {
    throw new Error('THREAD_REPOSITORY.VERIFY_METHOD_NOT_IMPLEMENTED');
  }

  async getThreadById(threadId) {
    throw new Error('THREAD_REPOSITORY.GET_BY_ID_METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadRepository;
