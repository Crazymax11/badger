const creator = {
  /**
   * Human readable badge name
   */
  name: 'lines-of-code',
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
        subject: 'lines-of-code'
      };
    }

    // convert status to your type explicit
    const lines = Number(status);
    if (lines <= 0) {
      return {
        color: 'red',
        status,
        subject: 'loc'
      };
    }

    const unitSize = lines >= 1000000 ? 1000000 : lines >= 1000 ? 1000 : 1;
    const unitLabels = {
      1: '',
      1000: 'k',
      1000000: 'M'
    };

    return {
      color: 'blue',
      subject: 'loc',
      status: `${Math.floor(lines / unitSize)}${unitLabels[unitSize]}`
    };
  },
  /**
   * Examples of statuses which will be used to show badges that can be created by this badge creator 
   */
  examples: [
    '0',
    '1',
    '10',
    '200',
    '1001',
    '66666',
    '134567890',
    '12345678900',
    'none'
  ],
  /**
   * Human readable description of badge purpose
   */
  description: 'Show lines of code in your project',

  /**
   * Image link (may be base64) which will be used as badge logo at git badger pages
   */
  image: ''
};

module.exports = creator;
