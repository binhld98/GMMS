import { Timestamp } from "firebase/firestore";

export type GroupMasterDto = {
  id: string;
  groupName: string;
  adminName: string;
  avatarUrl: string;
}

export type GroupDetailDto = {
  id: string;
  groupName: string;
  description: string;
  adminId: string,
  avatarUrl: string;
  users: UserGroupDto[]
}

export type UserGroupDto = {
  userId: string,
  userName: string,
  roleName: string,
  joinedDate: Timestamp
}