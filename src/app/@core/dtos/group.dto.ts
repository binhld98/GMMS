import { Timestamp } from 'firebase/firestore';
import { GROUP_USER_ROLE, GROUP_USER_STATUS } from '../models/group-user';

export type GroupMasterDto = {
  id: string;
  groupName: string;
  adminId: string;
  adminName: string;
  avatarUrl: string;
};

export type GroupDetailDto = {
  id: string;
  groupName: string;
  description: string;
  adminId: string;
  adminName: string;
  avatarUrl: string;
  users: GroupUserDto[];
};

export type GroupUserDto = {
  userId: string;
  userName: string;
  role: GROUP_USER_ROLE;
  joinedStatus: GROUP_USER_STATUS;
  joinedAt: Timestamp | null;
};
