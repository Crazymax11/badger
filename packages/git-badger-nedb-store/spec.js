// eslint-disable no-shadow
import testStore from 'git-badger-core/store-tests.js';

import Store from './index.js';

/**
 * Tests provided by git-badger-core
 */
testStore(
  // store factory. Will be called to get store before each test
  () => new Store(),
  // clear store. Will be called to cleanup resources of used store.
  () => Promise.resolve()
);
