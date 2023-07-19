class AddedComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, content, owner } = payload;
    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    const { id, content, owner } = payload;
    if (!id || !content || !owner) {
      throw new Error('ADDED_COMMENT.MISSING_REQUIRED_PROPERTIES');
    }
    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('ADDED_COMMENT.INVALID_DATA_TYPES');
    }
  }
}

module.exports = AddedComment;
