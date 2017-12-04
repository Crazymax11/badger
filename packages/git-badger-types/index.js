// @flow
export type Project = string;
export type Subject = string;
export type Status = string;
export type Time = number;

export type StoreReturn = {
  subject: Subject,
  status: Status
};

export type StoreRecord = {
  time: Time,
  status: Status
};

export type HistoryRecord = {
  subject: Subject,
  status: Status,
  time: Time
};

export type StoreStatus = {
  records: number,
  projects: number,
  subjects: number,
  status: string,
  additionalFields?: {
    [string]: string
  }
};

export type AppStatus = {
  status: string,
  badges: number,
  uptime: string,
  getRequestsProcessed: number,
  postRequestsProcessed: number
};

export interface Store {
  store(
    project: Project,
    subject: Subject,
    status: Status,
    time: Time
  ): Promise<StoreReturn>;
  getLast(project: Project, subject: Subject): Promise<StoreReturn>;
  getStatus(?Project, ?Subject): Promise<StoreStatus>;
  getLastN(
    count: number,
    project: Project,
    subject: Subject
  ): Promise<HistoryRecord[]>;
  getLastActivities(number, number): Promise<HistoryRecord[]>;
}

type Color =
  | 'brightgreen'
  | 'green'
  | 'yellowgreen'
  | 'orange'
  | 'red'
  | 'lightgrey'
  | 'blue';

export type Badge = {
  color: Color,
  status: Status,
  subject: Subject
};

export type BadgeCreator = {
  name: string,
  create(status: Status): Badge,
  examples: Status[],
  description: string
};
