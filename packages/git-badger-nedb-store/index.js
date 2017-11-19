// @flow
import DataStore from 'nedb';

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
} from 'git-badger-core/types.js';

class NeDBStore implements Store {
  db: any;
  constructor(path: ?string) {
    if (path) {
      this.db = new DataStore({
        filename: path,
        autoload: true
      });
    } else {
      this.db = new DataStore();
    }
  }

  /**
   * Stores record to something
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

    await new Promise((resolve, reject) =>
      this.db.insert(
        {
          project,
          time,
          subject,
          status
        },
        (err, doc) => (err ? reject(err) : resolve(doc))
      )
    );

    return {
      subject,
      status
    };
  }

  /**
   * Get last value from store
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

    const record =
      (await new Promise((resolve, reject) =>
        this.db
          .findOne({
            subject,
            project
          })
          .sort({ time: -1 })
          .exec((err, doc) => (err ? reject(err) : resolve(doc)))
      )) || undefined;

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

    // your logic here instead of this
    const records = await new Promise((resolve, reject) =>
      this.db
        .find({
          subject,
          project
        })
        .sort({ time: -1 })
        .limit(count)
        .exec((err, docs) => (err ? reject(err) : resolve(docs)))
    );

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
   * Get status of db
   * @param {?Project} project
   * @param {?Subject} subject
   */
  async getStatus(project: ?Project, subject: ?Subject): Promise<StoreStatus> {
    // your logic
    const records = await new Promise((resolve, reject) =>
      this.db
        .find({
          subject,
          project
        })
        .sort({ time: -1 })
        .exec((err, docs) => (err ? reject(err) : resolve(docs)))
    );

    const projectsSet = new Set();
    const subjectsSet = new Set();
    records.forEach(record => {
      projectsSet.add(record.project);
      subjectsSet.add(record.subject);
    });

    return {
      records: records.length,
      subjects: subjectsSet.size,
      projects: projectsSet.size,
      status: 'ok'
    };
  }
}

export default NeDBStore;
