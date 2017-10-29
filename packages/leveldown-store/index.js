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
  constructor(dbpath: string) {
    this.db = levelup(leveldown(dbpath));
  }

  async store(
    project: Project,
    subject: Subject,
    status: Status,
    time: Time
  ): Promise<StoreReturn> {
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
    let history = '[]';
    try {
      history = await this.db.get(`${project}-${subject}`);
    } catch (err) {
      history = '[]';
    }
    history = JSON.parse(history);
    const status = history.slice(-1)[0].status;
    if (typeof status === 'undefined') {
      return {
        status: 'none',
        subject
      };
    }

    return {
      status,
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
