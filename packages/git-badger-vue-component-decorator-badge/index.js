const creator = {
  /**
   * Humad readable badge name
   */
  name: 'vue-component-decorator',
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
    if (status === 'none' || isNaN(status)) {
        return {
            color: 'lightgrey',
            status: 'unknown',
            subject: 'vue-component-decorator'
        }
    }
    
    // convert status to your type explicit
    const errors = Number(status);
    if (errors > 0) {
      return {
        color: 'red',
        status,
        subject: 'vue-component-decorator'
      };
    }

    return {
      color: 'green',
      subject: 'vue-component-decorator',
      status: 'clean'
    };
  },
  /**
   * Examples of statuses which will be used to show badges that can be created by this badge creator 
   */
  examples: ['0', '1', '10', '20', '100', '999', 'none'],
  /**
   * Human readable description of badge purpose
   */
  description: 'Shows count of @VueComponent decorators in your project'
};

module.exports = creator;