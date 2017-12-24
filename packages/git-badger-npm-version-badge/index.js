const creator = {
  /**
   * Human readable badge name
   */
  name: 'npm-version',
  /**
   * Method invokes every time than need to create badge
   * @param {string} status 
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
        subject: 'npm'
      };
    }

    return {
      color: 'blue',
      subject: 'npm',
      status
    };
  },
  /**
   * Examples of statuses which will be used to show badges that can be created by this badge creator 
   */
  examples: [
    '0.0.0',
    '1',
    '1.0.0',
    '1.4',
    '1.4.1',
    '2.0.0-rc.1',
    '2.4.3-beta',
    'none'
  ],
  /**
   * Human readable description of badge purpose
   */
  description: 'Shows current npm version of your package',

  /**
   * Image link (may be base64) which will be used as badge logo at git badger pages
   */
  image: ''
};

module.exports = creator;
