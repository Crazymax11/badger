import { expect } from 'chai';
import storeTests from 'git-badger-core/store-tests.js';
import {
  storeToMysql,
  getLastFromMysql,
  isTableExist,
  createTable,
  RawMysqlStore
} from './index.js';

describe('MysqlStore', () => {
  it('should check database', () => {
    expect(isTableExist()).to.equal("SHOW TABLES LIKE 'badges';");
  });
  it('should should create database', () => {
    // replaces needed to remove indents in strings;
    const expected = `CREATE TABLE badges (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        project VARCHAR(30) NOT NULL,
        subject VARCHAR(30) NOT NULL,
        status VARCHAR(50) NOT NULL,
        time TIMESTAMP
    )`.replace(/\s+/, ' ');
    expect(createTable().replace(/\s+/, ' ')).to.equal(expected);
  });

  it('should insert badge', () => {
    expect(
      storeToMysql(
        'test-project',
        'test-subject',
        'test-status',
        Date.UTC(2017, 1)
      )
    ).to.equal(
      "INSERT INTO badges (project, subject, status, time) VALUES ('test-project', 'test-subject', 'test-status', 1485907200000)"
    );
  });

  it('should getLast value of badge', () => {
    expect(getLastFromMysql('test-project', 'test-subject')).to.equal(
      "SELECT status FROM badges WHERE project = 'test-project' AND subject = 'test-subject' ORDER BY id DESC LIMIT 1"
    );
  });
});

const pool = {
  query(q, cb) {
    const showTable = /SHOW TABLE/;
    const createTableQuery = /CREATE TABLE/;
    const getLast = /SELECT status FROM badges WHERE project = '([\w\d-]+)' AND subject = '([\w\d-]+)'/;
    const store = /INSERT INTO badges \(project, subject, status, time\) VALUES \('([\w\d-]+)', '([\w\d-]+)', '([\w\d-]+)', ([\w\d-]+)\)/;
    if (q.match(showTable)) {
      return cb(null, [1, 2, 3]);
    }

    if (q.match(createTableQuery)) {
      throw new Error('Table was returned in checkDb');
    }

    if (q.match(getLast)) {
      const [, project, subject] = q.match(getLast);
      if (this.history[project + subject]) {
        return cb(null, [
          {
            status: this.history[project + subject]
          }
        ]);
      }
      return cb(null, []);
    }

    if (q.match(store)) {
      const [, project, subject, status] = q.match(store);
      this.history[project + subject] = status;
      cb();
    }

    throw new Error(`Pool mock get unexpected query: ${q}`);
  },
  history: {}
};

storeTests(
  () => new RawMysqlStore(pool),
  store => {
    store.pool.history = {};
  }
);
