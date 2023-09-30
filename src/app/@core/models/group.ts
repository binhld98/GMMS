import { Entity } from './entity';
import { GroupUser } from './group-user';
import { GROUP_STATUS } from '../constants/common.constant';

export type Group = Entity & {
  groupName: string;
  groupDescription: string;
  avatarUrl: string;
  adminId: string;
  status: GROUP_STATUS;
  users: GroupUser[];
};
