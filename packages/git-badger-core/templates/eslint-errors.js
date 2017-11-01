// @flow
import type { Badge, Status, BadgeCreator } from '../types.js';

const creator: BadgeCreator = {
  name: 'eslint-errors',
  create(status: Status): Badge {
    const errors = Number(status);
    if (errors > 0) {
      return {
        color: 'red',
        status,
        subject: 'eslint-errros'
      };
    }

    return {
      color: 'green',
      subject: 'eslint-errors',
      status: 'clean'
    };
  },
  examples: ['0', '1', '10', '20', '100', '999', 'none'],
  description: 'badge to show count of eslint errors in your project'
};

export default creator;
