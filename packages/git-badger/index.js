// @flow
const cmdArgs = require('command-line-args');
const Store = require('git-badger-leveldown-store').default;
const server = require('git-badger-core').default;

const options = cmdArgs([
  {
    name: 'badges',
    alias: 'b',
    type: String,
    multiple: true,
    // provided with this package
    defaultValue: [
      'eslint-errors',
      'eslint-warnings',
      'flow-coverage',
      'test-coverage',
      'vue-component-decorator'
    ]
  }
]);

const badges = options.badges.reduce((acc, badge) => {
  try {
    // trying to get badge creator by mask
    // eslint-disable-next-line
    acc[badge] = require(`git-badger-${badge}-badge`);
  } catch (err) {
    // if didn't find then trying to require as is
    if (err.message.contains('Cannot find')) {
      // eslint-disable-next-line
      acc[badge] = require(badge);
    }
  }

  return acc;
}, {});

server(80, new Store('./db'), badges);
