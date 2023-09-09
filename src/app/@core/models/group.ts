import { Entity } from "./entity";
import { GroupUser } from "./group-user";

export interface Group extends Entity  {
  groupCode: string,
  groupName: string,
  avatarUrl: string,
  adminId: string,
  status: GROUP_STATUS,
  users: GroupUser
}

export enum GROUP_STATUS {

}