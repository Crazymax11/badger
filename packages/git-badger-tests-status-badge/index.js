const creator = {
  /**
   * Human readable badge name
   */
  name: 'tests-status',
  /**
   * Method invokes every time than need to create badge
   * Status must be a valid JSON and contain at least one of "passed", "skipped", "failed"
   * @param {string} status {passed: 123, failed: 123, skipped: 123}
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
        subject: 'tests'
      };
    }

    // convert status to your type explicit
    const { passed = 0, failed = 0, skipped = 0 } = JSON.parse(status);
    let color = 'green';
    if (failed > 0) {
      color = 'red';
    } else if (skipped > 0) {
      color = 'yellow';
    } else if (passed === 0) {
      color = 'lightgrey';
    }

    const statusToShow = [];
    // we need to show passed if passed > 0 or if skipped === 0 and failed === 0
    if (passed > 0 || (skipped === 0 && failed === 0)) {
      statusToShow.push(`passed ${passed}`);
    }

    if (skipped > 0) {
      statusToShow.push(`skipped ${skipped}`);
    }

    if (failed > 0) {
      statusToShow.push(`failed ${failed}`);
    }

    return {
      color,
      subject: 'tests',
      status: statusToShow.join(', ')
    };
  },
  /**
   * Examples of statuses which will be used to show badges that can be created by this badge creator 
   */
  examples: [
    JSON.stringify({ passed: 298 }),
    JSON.stringify({ passed: 298, skipped: 3 }),
    JSON.stringify({ passed: 298, skipped: 3, failed: 4 }),
    JSON.stringify({ passed: 0 }),
    JSON.stringify({ failed: 3, skipped: 3 }),
    JSON.stringify({ failed: 0, skipped: 0 }),
    JSON.stringify({ passed: 298, failed: 4 }),
    'none'
  ],
  /**
   * Human readable description of badge purpose
   */
  description:
    'Shows count of passed, failed and skipped tests in your project.',

  /**
   * Image link (may be base64) which will be used as badge logo at git badger pages
   */
  image: ''
};

module.exports = creator;
