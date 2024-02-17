import { Entity } from './entity';
import { GroupUser } from './group-user';

export type User = Entity & {
  userName: string;
  email: string;
  groups: GroupUser[];
};
