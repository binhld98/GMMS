import { Entity } from './entity';
import { GroupUser } from './group-user';

export interface User extends Entity {
  userCode: string;
  userName: string;
  email: string;
  avatarUrl: string;
  groups: GroupUser[];
}
