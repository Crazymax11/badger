// @flow
import Store from 'git-badger-leveldown-store';
import server from 'git-badger-core';

import eslintErrorsBadge from './badges/eslint-errors.js';

const badges = {
  'eslint-errors': eslintErrorsBadge
};

server(80, new Store('./tmp/db'), badges);
