// @flow

import type { Project, Status, Subject } from './types.js';

export type StoreReturn = {
  subject: Subject,
  status: Status
};
export type Time = number;
export interface Store {
  store(
    project: Project,
    subject: Subject,
    status: Status,
    time: Time
  ): Promise<StoreReturn>;
  getLast(project: Project, subject: Subject): Promise<StoreReturn>;
}
