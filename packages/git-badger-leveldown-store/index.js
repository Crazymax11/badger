// @flow
import levelup from 'levelup';
import leveldown from 'leveldown';

import type {
  Store,
  StoreReturn,
  Time,
  Project,
  Subject,
  Status,
  StoreRecord,
  StoreStatus,
  HistoryRecord
} from 'git-badger-types';

class LeveldownStore implements Store {
  db: any;
  dbpath: string;
  constructor({ dbpath }: { dbpath: string }) {
    this.dbpath = dbpath;
    this.db = levelup(leveldown(dbpath));
  }

  /**
   * Stores record to levelDb
   * 
   * @param {Project} project
   * @param {Subject} subject
   * @param {Status} status
   * @param {Time} time
   */
  async store(
    project: Project,
    subject: Subject,
    status: Status,
    time: Time
  ): Promise<StoreReturn> {
    if (typeof time !== 'number') {
      throw new Error('time must be a number');
    }

    if (typeof status !== 'string') {
      throw new Error('status must be a string');
    }

    if (typeof project !== 'string') {
      throw new Error('project must be a string');
    }

    if (typeof subject !== 'string') {
      throw new Error('subject must be a string');
    }

    const key = getKey(project, subject);
    const history = await getFromLevelDB(this.db, key);

    history.push({
      status,
      time
    });

    await putToLevelDB(this.db, key, history);

    return {
      subject,
      status
    };
  }

  /**
   * Get last value from LevelDb
   * 
   * @param {Project} project 
   * @param {Subject} subject 
   */
  async getLast(project: Project, subject: Subject): Promise<StoreReturn> {
    if (typeof subject !== 'string') {
      throw new Error('subject must be a string');
    }

    if (typeof project !== 'string') {
      throw new Error('project must be a string');
    }

    const key = getKey(project, subject);
    const history = await getFromLevelDB(this.db, key);
    const record = history.slice(-1)[0];

    if (typeof record === 'undefined') {
      return {
        status: 'none',
        subject
      };
    }

    return {
      status: record.status,
      subject
    };
  }

  async getLastN(
    count: number,
    project: Project,
    subject: Subject
  ): Promise<HistoryRecord[]> {
    if (typeof count !== 'number') {
      throw new Error('count must be a number');
    }
    if (typeof subject !== 'string') {
      throw new Error('subject must be a string');
    }

    if (typeof project !== 'string') {
      throw new Error('project must be a string');
    }

    const key = getKey(project, subject);
    const history = await getFromLevelDB(this.db, key);
    const records = history.slice(-count);

    if (!records.length) {
      return [
        {
          status: 'none',
          subject,
          time: 0
        }
      ];
    }

    return records.map(record => ({
      status: record.status,
      subject,
      time: record.time
    }));
  }

  /**
   * Open levelDB
   */
  open() {
    return this.db.open();
  }

  /**
   * Close levelDB
   */
  close() {
    return this.db.close();
  }

  /**
   * Get status of db
   * @param {?Project} project
   * @param {?Subject} subject
   */
  getStatus(project: ?Project, subject: ?Subject): Promise<StoreStatus> {
    return getDbStatus(this.db, project, subject);
  }
}

/**
 * Constructs key for levelDb from project and subject
 * 
 * @param {Project} project 
 * @param {Subject} subject 
 * @returns {string} levelDb key
 */
function getKey(project: Project, subject: Subject): string {
  return `${project}---${subject}`;
}

function parseKey(key: string): { project: Project, subject: Subject } {
  const [project, subject] = key.split('---');
  return {
    project,
    subject
  };
}

function getDbStatus(db: any, project: ?Project, subject: ?Subject) {
  let records = 0;
  const projectsSet = new Set();
  const subjectsSet = new Set();
  return new Promise(resolve => {
    db
      .createReadStream()
      .on('data', data => {
        const { subject: dataSubject, project: dataProject } = parseKey(
          String(data.key)
        );
        if (project && project !== dataProject) {
          return;
        }

        if (subject && subject !== dataSubject) {
          return;
        }

        projectsSet.add(dataProject);
        subjectsSet.add(dataSubject);
        records += JSON.parse(data.value).length;
      })
      .on('error', err =>
        resolve({
          status: err.toString(),
          projects: 0,
          subjects: 0,
          records: 0
        })
      )
      .on('end', () =>
        resolve({
          status: 'ok',
          projects: projectsSet.size,
          subjects: subjectsSet.size,
          records
        })
      );
  });
}

/**
 * Get key from levelDB. If any error, [] will be returned
 * @param {leveldb} db leveldb instance
 * @param {string} key leveldb key
 */
function getFromLevelDB(db: any, key: string): Promise<StoreRecord[]> {
  return db
    .get(key)
    .catch(() => '[]')
    .then(rawValue => JSON.parse(rawValue));
}

/**
 * 
 * @param {levelDb} db levelDB instance
 * @param {key} key levelDB key
 * @param {any} value value will be JSON.stringified
 */
function putToLevelDB(db: any, key: string, value: any): Promise<any> {
  return db.put(key, JSON.stringify(value));
}

export default LeveldownStore;
