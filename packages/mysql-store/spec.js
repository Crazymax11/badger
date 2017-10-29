import { expect } from 'chai';
import {
  storeToMysql,
  getLastFromMysql,
  isTableExist,
  createTable
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
