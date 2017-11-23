import { expect } from 'chai';
import { basicSuite } from '@git-badger/store-tests';
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
    expect(getLastFromMysql('test-project', 'test-subject', 1)).to.equal(
      "SELECT status FROM badges WHERE project = 'test-project' AND subject = 'test-subject' ORDER BY id DESC LIMIT 1"
    );
    expect(getLastFromMysql('test-project', 'test-subject', 100)).to.equal(
      "SELECT status FROM badges WHERE project = 'test-project' AND subject = 'test-subject' ORDER BY id DESC LIMIT 100"
    );
  });
});

const pool = {
  query(q, cb) {
    const showTable = /SHOW TABLE/;
    const createTableQuery = /CREATE TABLE/;
    const getLast = /SELECT status FROM badges WHERE project = '([\w\d-]+)' AND subject = '([\w\d-]+)' .* LIMIT (\d+)/;
    const store = /INSERT INTO badges \(project, subject, status, time\) VALUES \('([\w\d-]+)', '([\w\d-]+)', '([\w\d-]+)', ([\w\d-]+)\)/;
    const getStatus = /SELECT COUNT\(\*\) as records, COUNT\(DISTINCT subject\) as subjects, COUNT\(DISTINCT project\) as projects FROM badges WHERE project = '([\w\d-]+)' AND subject = '([\w\d-]+)'/;
    const getAllStatus = /SELECT COUNT\(\*\) as records, COUNT\(DISTINCT subject\) as subjects, COUNT\(DISTINCT project\) as projects FROM badges/;
    const getOnlyProjectStatus = /SELECT COUNT\(\*\) as records, COUNT\(DISTINCT subject\) as subjects, COUNT\(DISTINCT project\) as projects FROM badges WHERE project = '([\w\d-]+)'/;
    const getOnlySubjectStatus = /SELECT COUNT\(\*\) as records, COUNT\(DISTINCT subject\) as subjects, COUNT\(DISTINCT project\) as projects FROM badges WHERE subject = '([\w\d-]+)'/;
    if (q.match(showTable)) {
      return cb(null, [1, 2, 3]);
    }

    if (q.match(createTableQuery)) {
      throw new Error('Table was returned in checkDb');
    }

    if (q.match(getLast)) {
      const [, project, subject, limit] = q.match(getLast);
      const result = this.history
        .filter(
          record => record.subject === subject && record.project === project
        )
        .slice(-limit);
      return cb(null, result);
    }

    if (q.match(store)) {
      const [, project, subject, status, time] = q.match(store);
      this.history[project + subject] = status;
      this.history.push({
        project,
        subject,
        status,
        time: Number(time)
      });
      return cb();
    }
    if (q.match(getStatus)) {
      const [, project, subject] = q.match(getStatus);
      return cb(null, [
        {
          records: this.history.filter(
            record => record.project === project && record.subject === subject
          ).length,
          projects: 1,
          subjects: 1,
          status: 'ok'
        }
      ]);
    }

    if (q.match(getOnlyProjectStatus)) {
      const [, project] = q.match(getOnlyProjectStatus);
      const subjects = new Set();
      const records = this.history.filter(record => {
        if (record.project === project) {
          subjects.add(record.subject);
          return true;
        }
        return false;
      });

      return cb(null, [
        {
          records: records.length,
          projects: 1,
          subjects: subjects.size,
          status: 'ok'
        }
      ]);
    }

    if (q.match(getOnlySubjectStatus)) {
      const [, subject] = q.match(getOnlySubjectStatus);
      const projects = new Set();
      const records = this.history.filter(record => {
        if (record.subject === subject) {
          projects.add(record.project);
          return true;
        }
        return false;
      });

      return cb(null, [
        {
          records: records.length,
          subjects: 1,
          projects: projects.size,
          status: 'ok'
        }
      ]);
    }

    if (q.match(getAllStatus)) {
      const projects = new Set();
      const subjects = new Set();
      const records = this.history.filter(record => {
        projects.add(record.project);
        subjects.add(record.subject);
        return true;
      });

      return cb(null, [
        {
          records: records.length,
          subjects: subjects.size,
          projects: projects.size,
          status: 'ok'
        }
      ]);
    }

    throw new Error(`Pool mock get unexpected query: ${q}`);
  },
  history: []
};

basicSuite(
  () => new RawMysqlStore(pool),
  store => {
    store.pool.history = [];
  }
);
