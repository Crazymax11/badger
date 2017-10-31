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

export interface Store {
  store(
    project: Project,
    subject: Subject,
    status: Status,
    time: Time
  ): Promise<StoreReturn>;
  getLast(project: Project, subject: Subject): Promise<StoreReturn>;
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

export type BadgeCreator = (status: Status) => Badge;
