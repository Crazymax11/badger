// @flow
import DataStore from 'nedb';

import type {
  Store,
  StoreReturn,
  Time,
  Project,
  Subject,
  Status,
  StoreStatus,
  HistoryRecord
} from '@git-badger/types';

class NeDBStore implements Store {
  db: any;
  constructor({ path }: { path: ?string } = {}) {
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

    if (count <= 0) {
      throw new Error('count must be positive number');
    }

    if (!Number.isInteger(count)) {
      throw new Error('count must be an interger');
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

    return records.reverse().map(record => ({
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
    if (project != null && typeof project !== 'string') {
      throw new Error('Project must be string or undefined');
    }

    if (subject != null && typeof subject !== 'string') {
      throw new Error('Subject must be string or undefined');
    }

    const findOptions = {};
    if (subject) {
      findOptions.subject = subject;
    }
    if (project) {
      findOptions.project = project;
    }
    const records = await new Promise((resolve, reject) =>
      this.db
        .find(findOptions)
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

  async getLastActivities(
    offset: number,
    limit: number
  ): Promise<HistoryRecord[]> {
    if (!Number.isInteger(offset)) {
      throw new Error('offset must be an integer');
    }

    if (!Number.isInteger(limit)) {
      throw new Error('limi must be an integer');
    }

    if (offset < 0) {
      throw new Error('offset must be higher or equal zero');
    }

    if (limit < 1) {
      throw new Error('limit must be a positive integer');
    } else if (limit > 100) {
      throw new Error('limit must be below 100');
    }

    const records = await new Promise((resolve, reject) =>
      this.db
        .find({})
        .sort({ time: -1 })
        .skip(offset)
        .limit(limit)
        .exec((err, docs) => (err ? reject(err) : resolve(docs)))
    );

    return records.map(record => ({
      project: record.project,
      status: record.status,
      subject: record.subject,
      time: record.time
    }));
  }

  async getProjectStatus(project: Project): Promise<HistoryRecord[]> {
    if (!project) {
      throw new Error('Project is not provided');
    }

    if (typeof project !== 'string') {
      throw new Error('Project must be a string');
    }

    // TODO: this is really shit method because it will work slow on large amount of records
    const records = await new Promise((resolve, reject) =>
      this.db
        .find({ project })
        .sort({ time: -1 })
        .exec((err, docs) => (err ? reject(err) : resolve(docs)))
    );

    return records.reduce((arr, record) => {
      if (!arr.some(item => item.subject === record.subject)) {
        arr.push({
          time: record.time,
          project: record.project,
          subject: record.subject,
          status: record.status
        });
      }

      return arr;
    }, []);
  }
}

export default NeDBStore;
