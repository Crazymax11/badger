// @flow
import { expect } from 'chai';
import rimraf from 'rimraf';
import testStore from 'git-badger-core/store-tests.js';
import type {
  Status,
  Project,
  Subject,
  Time,
  StoreStatus
} from 'git-badger-core/types.js';

import Store from './index.js';

// eslint-disable-next-line
describe('#leveldownStore', function test() {
  beforeEach(function hook() {
    this.context = {};
    const dbPath = `test-${Date.now()}`;
    const store = new Store(`./${dbPath}`);
    this.context.store = store;
  });
  afterEach(function hook() {
    const dbPath = this.context.store.dbpath;
    this.context.store.close();
    return new Promise((resolve, reject) => {
      rimraf(dbPath, err => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        return resolve();
      });
    });
  });
  it('should store and return value', async function test() {
    const store = this.context.store;
    await store.store('test-project', 'test-subject', 'test-status', 123);
    const result = await store.getLast('test-project', 'test-subject');
    expect(result).be.deep.equal({
      status: 'test-status',
      subject: 'test-subject'
    });
  });
  describe('#getStatus', () => {
    it('should return right status', async function test() {
      const store = this.context.store;
      const records = await fillStore(200, store);
      const projects = new Set();
      const subjects = new Set();
      records.forEach(record => {
        projects.add(record.project);
        subjects.add(record.subject);
      });

      const status = await store.getStatus();
      expect(status).to.be.deep.equal({
        records: records.length,
        projects: projects.size,
        subjects: subjects.size,
        status: 'ok'
      });
    });
    it('should filter by project', async function test() {
      const store = this.context.store;
      const records = await fillStore(200, store);
      const subjects = new Set();
      const targetProject = records[0].project;
      const recordsCount = records
        .filter(record => record.project === targetProject)
        .map(record => {
          subjects.add(record.subject);
          return record;
        }).length;

      const status = await store.getStatus(targetProject);
      expect(status).to.be.deep.equal({
        records: recordsCount,
        projects: 1,
        subjects: subjects.size,
        status: 'ok'
      });
    });
    it('should return status by subject', async function test() {
      const store = this.context.store;
      const records = await fillStore(200, store);
      const projects = new Set();
      const targetSubject = records[0].subject;
      const recordsCount = records
        .filter(record => record.subject === targetSubject)
        .map(record => {
          projects.add(record.project);
          return record;
        }).length;

      const status = await store.getStatus(null, targetSubject);
      expect(status).to.be.deep.equal({
        records: recordsCount,
        projects: projects.size,
        subjects: 1,
        status: 'ok'
      });
    });
    it('should return status by subject and project', async function test() {
      const store = this.context.store;
      const records = await fillStore(200, store);
      const targetSubject = records[0].subject;
      const targetProject = records[0].project;
      const recordsCount = records
        .filter(record => record.subject === targetSubject)
        .filter(record => record.project === targetProject).length;

      const status = await store.getStatus(targetProject, targetSubject);
      expect(status).to.be.deep.equal({
        records: recordsCount,
        projects: 1,
        subjects: 1,
        status: 'ok'
      });
    });
  });

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

testStore(
  () => new Store(`./test-${Date.now()}.db`),
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
type StoreArgs = {
  project: Project,
  subject: Subject,
  status: Status,
  time: Time
};

function createRandomRecord(): StoreArgs {
  return {
    project: `test-${Math.ceil(Math.random() * 10)}`,
    subject: `test-${Math.ceil(Math.random() * 10)}`,
    status: `test-${Math.ceil(Math.random() * 10)}`,
    time: Date.now()
  };
}

async function fillStore(count: number, store: Store): Promise<StoreArgs[]> {
  const records = [];
  for (let i = 0; i < count; i += 1) {
    const { project, subject, status, time } = createRandomRecord();
    records.push({
      project,
      subject,
      status,
      time
    });
    await store.store(project, subject, status, time);
  }
  return records;
}
