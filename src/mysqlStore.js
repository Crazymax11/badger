// @flow
import mysql from 'mysql';
import type { Pool } from 'mysql';
import type { Store, StoreReturn, Time } from './store.types.js';
import type { Project, Subject, Status } from './types.js';

type Host = string;
type User = string;
type Password = string;
type Database = string;
type MysqlQuery = string;

class MysqlStore implements Store {
  pool: Pool;
  constructor(host: Host, user: User, password: Password, database: Database) {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host,
      user,
      password,
      database
    });
  }
  checkDb(): Promise<boolean> {
    const query = isTableExist();
    return new Promise((resolve, reject) => {
      this.pool.query(query, (err, result) => {
        if (err) {
          return reject(err);
        }

        if (result.length) {
          return resolve(true);
        }

        return resolve(false);
      });
    });
  }

  createDb(): Promise<any> {
    const query = createTable();
    return new Promise((resolve, reject) => {
      this.pool.query(query, err => {
        if (err) {
          return reject(err);
        }

        return resolve(true);
      });
    });
  }
  store(
    project: Project,
    subject: Subject,
    status: Status,
    time: Time
  ): Promise<StoreReturn> {
    return new Promise((resolve, reject) => {
      const query = storeToMysql(project, subject, status, time);
      this.pool.query(query, err => {
        if (err) {
          return reject(err);
        }

        return resolve({
          subject,
          status
        });
      });
    });
  }

  getLast(project: Project, subject: Subject): Promise<StoreReturn> {
    return new Promise((resolve, reject) => {
      this.pool.query(
        'SELECT status FROM badges WHERE project = ? AND subject = ? LIMIT 1',
        (err, result) => {
          if (err) {
            return reject(err);
          }

          if (!result.length) {
            // TODO сделать обработку ненверных данных баджами
            return resolve({
              status: 'none',
              subject
            });
          }
          return resolve({
            status: result[0].status,
            subject
          });
        }
      );
    });
  }
}

export function storeToMysql(
  project: Project,
  subject: Subject,
  status: Status,
  time: Time
): MysqlQuery {
  return mysql.format(
    'INSERT INTO badges (project, subject, status, time) VALUES (?, ?, ?, ?)',
    [project, subject, status, time]
  );
}

export function getLastFromMysql(
  project: Project,
  subject: Subject
): MysqlQuery {
  return mysql.format(
    'SELECT status FROM badges WHERE project = ? AND subject = ? ORDER BY id DESC LIMIT 1',
    [project, subject]
  );
}

export function isTableExist(): MysqlQuery {
  return "SHOW TABLES LIKE 'badges';";
}

export function createTable(): MysqlQuery {
  return `CREATE TABLE badges (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        project VARCHAR(30) NOT NULL,
        subject VARCHAR(30) NOT NULL,
        status VARCHAR(50) NOT NULL,
        time TIMESTAMP
    )`;
}

export default MysqlStore;
