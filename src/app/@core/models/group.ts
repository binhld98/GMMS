import { Entity } from './entity';
import { GroupUser } from './group-user';

export type Group = Entity & {
  groupName: string;
  groupDescription: string;
  avatarUrl: string;
  adminId: string;
  status: GROUP_STATUS;
  users: GroupUser[];
};

export enum GROUP_STATUS {
  CREATED = 1,
}
