const creator = {
  /**
   * Human readable badge name
   */
  name: 'todos',
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
        subject: 'todos'
      };
    }

    // convert status to your type explicit
    const todos = Number(status);
    if (todos > 0 && todos <= 10) {
      return {
        color: 'green',
        status,
        subject: 'todos'
      };
    } else if (todos > 10) {
      return {
        color: 'yellow',
        status,
        subject: 'todos'
      };
    }
    return {
      color: 'green',
      subject: 'todos',
      status: 'clean'
    };
  },
  /**
   * Examples of statuses which will be used to show badges that can be created by this badge creator 
   */
  examples: ['0', '1', '10', '11', '100', '999', 'none'],
  /**
   * Human readable description of badge purpose
   */
  description: 'Show count of todos in your project',

  /**
   * Image link (may be base64) which will be used as badge logo at git badger pages
   */
  image: ''
};

module.exports = creator;
