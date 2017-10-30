// @flow
import levelup from 'levelup';
import leveldown from 'leveldown';

import type {
  Store,
  StoreReturn,
  Time,
  Project,
  Subject,
  Status
} from 'git-badger-core/types.js';

class LeveldownStore implements Store {
  db: any;
  dbpath: string;
  constructor(dbpath: string) {
    this.dbpath = dbpath;
    this.db = levelup(leveldown(dbpath));
  }

  async store(
    project: Project,
    subject: Subject,
    status: Status,
    time: Time
  ): Promise<StoreReturn> {
    if (typeof time !== 'number') {
      throw new Error('time must be number');
    }

    if (typeof status !== 'string') {
      throw new Error('status must be string');
    }

    if (typeof project !== 'string') {
      throw new Error('project must be string');
    }

    if (typeof subject !== 'string') {
      throw new Error('subject must be string');
    }
    let history = '[]';
    try {
      history = await this.db.get(`${project}-${subject}`);
    } catch (err) {
      history = '[]';
    }
    history = JSON.parse(history);
    history.push({
      status,
      time
    });
    await this.db.put(`${project}-${subject}`, JSON.stringify(history));
    return {
      subject,
      status
    };
  }

  async getLast(project: Project, subject: Subject): Promise<StoreReturn> {
    if (typeof subject !== 'string') {
      throw new Error('subject must be a string');
    }

    if (typeof project !== 'string') {
      throw new Error('project must be a string');
    }
    let history = '[]';
    try {
      history = await this.db.get(`${project}-${subject}`);
    } catch (err) {
      history = '[]';
    }
    history = JSON.parse(history);
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

  open() {
    return this.db.open();
  }
  close() {
    return this.db.close();
  }
}

export default LeveldownStore;
