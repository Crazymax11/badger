// eslint-disable no-shadow
import { expect } from 'chai';
import { basicSuite } from 'git-badger-store-tests';

import Store from './index.js';

// eslint-disable-next-line
describe('#<%= name %>', function test() {
  // your specific tests
  describe('#store');
  describe('#getLast');
  describe('#getLastN');
  describe('#getStatus');
});

/**
 * Tests provided by git-badger-store-tests
 */
basicSuite(
  // store factory. Will be called to get store before each test
  () => new Store(),
  // clear store. Will be called to cleanup resources of used store.
  store => new Promise((resolve, reject) => resolve())
);
