const DomainErrorTranslator = require('../DomainErrorTranslator');
const InvariantError = require('../InvariantError');

describe('DomainErrorTranslator', () => {
  it('should translate error correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_LIMIT_CHAR')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'));
    expect(DomainErrorTranslator.translate(new Error('NEW_THREAD.MISSING_REQUIRED_PROPERTIES')))
      .toStrictEqual(new InvariantError('NEW_THREAD.MISSING_REQUIRED_PROPERTIES'));
    expect(DomainErrorTranslator.translate(new Error('NEW_THREAD.INVALID_DATA_TYPES')))
      .toStrictEqual(new InvariantError('Thread baru tidak dapat dibuat karena tipe data yang dilampirkan tidak sesuai'));
    expect(DomainErrorTranslator.translate(new Error('NEW_COMMENT.MISSING_REQUIRED_PROPERTIES')))
      .toStrictEqual(new InvariantError('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('NEW_COMMENT.INVALID_DATA_TYPES')))
      .toStrictEqual(new InvariantError('tidak dapat membuat comment baru karena tipe data tidak sesuai'));
  });

  it('should return original error when error message is not needed to translate', () => {
    // Arrange
    const error = new Error('some_error_message');

    // Action
    const translatedError = DomainErrorTranslator.translate(error);

    // Assert
    expect(translatedError).toStrictEqual(error);
  });
});
