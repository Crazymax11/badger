// @flow
export type Project = string;
export type Subject = string;
export type Status = string;

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
