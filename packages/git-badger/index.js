// @flow
import Store from 'git-badger-leveldown-store';
import server, { templates } from 'git-badger-core';

// const badges = {
//   'eslint-errors': eslintErrorsBadge
// };

server(80, new Store('tmp/db'), templates);
