const creator = {
  /**
   * Human readable badge name
   */
  name: 'code-size',
  /**
   * Method invokes every time than need to create badge
   * @param {string} status in bytes
   * @return {Object} badge - meta data used to create badge with shields.io
   * @return {string} badge.color - badge color - one of shields.io colors
   * available colors for now are 'brightgreen', 'green', 'yellowgreen', 'orange', 'red', 'lightgrey', 'blue'
   * @return {string} badge.subject - text on left side of badge
   * @return {string} badge.status - text on right side of badge
   */
  create(status) {
    // it will be none if status is unknown (was not provided before but was asked for example)
    if (status === 'none') {
      return {
        color: 'lightgrey',
        status: 'unknown',
        subject: 'code'
      };
    }

    // convert status to your type explicit
    let bytes = Number(status);

    // unit type can be calculated by division on 1024
    // array contains ready to badge unit names
    const types = ['b', 'kb', 'mb', 'gb', 'tb'];
    let type = '';
    do {
      type = types.shift();
      bytes /= 1024;
    } while (bytes >= 1024);

    // JS magic, 2 + 3 = 5.0000000000000001
    bytes = Math.round(bytes);

    return {
      color: 'green',
      subject: 'code',
      status: `${bytes} ${type}`
    };
  },
  /**
   * Examples of statuses which will be used to show badges that can be created by this badge creator 
   */
  examples: [
    '0',
    '1',
    '1234',
    '123456',
    '123456789',
    '123456789123',
    '123456789123456',
    '123456789123456789',
    'none'
  ],
  /**
   * Human readable description of badge purpose
   */
  description: 'Show code size in bytes',

  /**
   * Image link (may be base64) which will be used as badge logo at git badger pages
   */
  image: ''
};

module.exports = creator;
