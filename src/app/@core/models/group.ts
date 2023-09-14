import { Entity } from './entity';
import { GroupUser } from './group-user';

export interface Group extends Entity {
  groupName: string;
  groupDescription: string;
  avatarUrl: string;
  adminId: string;
  status: GROUP_STATUS;
  users: GroupUser[];
}

export enum GROUP_STATUS {
  CREATED = 1,
}
