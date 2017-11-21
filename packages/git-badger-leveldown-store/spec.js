// eslint-disable no-shadow
import { expect } from 'chai';
import rimraf from 'rimraf';
import {basicSuite} from '@git-badger/store-tests';

import Store from './index.js';

basicSuite(
  () => new Store({dbpath: `./test-${Date.now()}.db`}),
  store =>
    new Promise((resolve, reject) => {
      store.close(err => {
        if (err) {
          return reject(err);
        }
      });
      setTimeout(resolve, 100);
    }).then(
      () =>
        new Promise((resolve, reject) => {
          rimraf(store.dbpath, err => {
            if (err) {
              console.error(err);
              return reject(err);
            }
            return resolve();
          });
        })
    )
);
