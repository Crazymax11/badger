const creator = {
  /**
   * Humad readable badge name
   */
  name: 'test-coverage',
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
    
    if (status === 'none' || isNaN(status)) {
      return {
          color: 'lightgrey',
          status: 'unknown',
          subject: 'flow-coverage'
      }
    }
  
    // convert status to your type explicit
    const coverage = Number(status);
    const color = coverage > 90 ? 'brightgreen' :
      coverage > 80 ? 'green' :
      coverage > 60 ? 'yellowgreen' :
      coverage > 40 ? 'yellow' :
      coverage > 20 ? 'orange' :
      'red';

    return {
      color: color,
      subject: 'test-coverage',
      status: status
    };
  },
  /**
   * Examples of statuses which will be used to show badges that can be created by this badge creator 
   */
  examples: ['100', '95', '88', '77', '66', '55', '42', '24', '12', 'none'],
  /**
   * Human readable description of badge purpose
   */
  description: 'Shows test coverage of your project'
};

module.exports = creator;
