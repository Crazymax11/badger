<% if (flow) { %> // @flow  

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

<% } %>

class <%= name %>  <% if (flow) { %> implements Store  <% } %>{
  constructor() {}

  /**
   * Stores record to something
   * 
   * @param {Project} project
   * @param {Subject} subject
   * @param {Status} status
   * @param {Time} time
   */
  async store(
    project<% if (flow) { %>: Project <% } %>,
    subject<% if (flow) { %>: Subject <% } %>,
    status<% if (flow) { %>: Status <% } %>,
    time<% if (flow) { %>: Time <% } %>
  )<% if (flow) { %>: Promise<StoreReturn> <% } %> {
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

    // your logic

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
  async getLast(project <% if (flow) { %>: Project <% } %> , subject<% if (flow) { %>: Subject <% } %> ): <% if (flow) { %> Promise<StoreReturn> <% } %> {
    if (typeof subject !== 'string') {
      throw new Error('subject must be a string');
    }

    if (typeof project !== 'string') {
      throw new Error('project must be a string');
    }

    // your logic instead of this
    const record = {
        status: 'none',
        subject
      };

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
    count<% if (flow) { %>: number<% } %>,
    project<% if (flow) { %>: Project<% } %>,
    subject<% if (flow) { %>: Subject<% } %>
  )<% if (flow) { %>: Promise<HistoryRecord[]> <% } %>{
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
    const records = [
        {
          status: 'none',
          subject,
          time: 0
        }
      ];

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
  getStatus(project<% if (flow) { %>: ?Project <% } %>, subject<% if (flow) { %>: ?Subject<% } %>)<% if (flow) { %>: Promise<StoreStatus> <% } %> {
    // your logic
  }
}

export default <%= name %>;
