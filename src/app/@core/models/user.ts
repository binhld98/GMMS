import { Entity } from './entity';
import { GroupUser } from './group-user';

export type User = Entity & {
  userCode: string;
  userName: string;
  email: string;
  avatarUrl: string;
  groups: GroupUser[];
};
