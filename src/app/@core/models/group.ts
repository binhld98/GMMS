import { Entity } from './entity';
import { GroupUser } from './group-user';

export type Group = Entity & {
  groupName: string;
  groupDescription: string;
  adminId: string;
  users: GroupUser[];
};
