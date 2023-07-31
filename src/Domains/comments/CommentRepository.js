class CommentRepository {
  async addComment(newComment) {
    throw new Error('COMMENT_REPOSITORY.ADD_METHOD_NOT_IMPLEMENTED');
  }

  async verifyCommentOwner(id, owner) {
    throw new Error('COMMENT_REPOSITORY.VERIFY_METHOD_NOT_IMPLEMENTED');
  }

  async deleteCommentById(id) {
    throw new Error('COMMENT_REPOSITORY.DELETE_METHOD_NOT_IMPLEMENTED');
  }

  async verifyAvailableCommentInsideThread(id, threadId) {
    throw new Error('COMMENT_REPOSITORY.VERIFY_INSIDE_THREAD_METHOD_NOT_IMPLEMENTED');
  }

  async getCommentsByThreadId(threadId) {
    throw new Error('COMMENT_REPOSITORY.GET_COMMENT_BY_ID_METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = CommentRepository;