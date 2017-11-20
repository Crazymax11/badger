// eslint-disable no-shadow
import { basicSuite } from 'git-badger-store-tests/index.js';

import Store from './index.js';

/**
 * Tests provided by git-badger-core
 */
basicSuite(
  // store factory. Will be called to get store before each test
  () => new Store(),
  // clear store. Will be called to cleanup resources of used store.
  () => Promise.resolve()
);
