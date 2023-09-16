import { Timestamp } from 'firebase/firestore';

export type GroupUser = {
  groupId: string | null;
  userId: string;
  invitorId: string | null;
  invitedAt: Timestamp | null;
  joinedAt: Timestamp | null;
  status: GROUP_USER_STATUS;
  role: GROUP_USER_ROLE;
};

export enum GROUP_USER_STATUS {
  JOINED = 1,
  WAIT_CONFIRM = 2,
  DEACTIVATED = 3,
}

export enum GROUP_USER_ROLE {
  ADMIN = 1,
  MEMBER = 2,
}
