class AddedThread {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, title, owner } = payload;
    this.id = id;
    this.title = title;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    const { id, title, owner } = payload;
    if (!id || !title || !owner) {
      throw new Error('ADDED_THREAD.MISSING_REQUIRED_PROPERTIES');
    }
    if (typeof id !== 'string' || typeof title !== 'string' || typeof owner !== 'string') {
      throw new Error('ADDED_THREAD.INVALID_DATA_TYPES');
    }
  }
}

module.exports = AddedThread;
