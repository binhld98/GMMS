import {
  GROUP_USER_ROLE,
  GROUP_USER_STATUS,
} from '../constants/common.constant';

export type GroupInUserDto = {
  groupId: string;
  groupName: string;
  adminId: string;
  adminName: string;
  groupUserStatus: GROUP_USER_STATUS;
};

export type UserInGroupDto = {
  userId: string;
  userName: string;
  role: GROUP_USER_ROLE;
  groupUserStatus: GROUP_USER_STATUS;
  invitedAt: Date | null;
  joinedAt: Date | null;
  deactivatedAt: Date | null;
  activatedAt: Date | null;
};
