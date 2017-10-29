import { expect } from 'chai';
import rimraf from 'rimraf';
import Store from './index.js';

describe('#leveldownStore', () => {
  it('should be created', () => {
    const store = new Store('./test-should-be-created.db');
    return store.close();
  });
  it('should store and return value', async () => {
    const store = new Store('./test-should-store.db');
    await store.store('test-project', 'test-subject', 'test-status', 123);
    const result = await store.getLast('test-project', 'test-subject');
    expect(result).be.deep.equal({
      status: 'test-status',
      subject: 'test-subject'
    });
    return store.close();
  });
  it('should return none then no status');
  after(() => {
    rimraf('./test-should-store.db', err => {
      if (err) {
        console.error(err);
      }
    });
    rimraf('./test-should-be-created.db', err => {
      if (err) {
        console.error(err);
      }
    });
  });
});
