import { Timestamp } from 'firebase/firestore';
import {
  GROUP_USER_ROLE,
  GROUP_USER_STATUS,
} from '../constants/common.constant';

export type GroupUser = {
  groupId: string;
  userId: string;
  invitorId: string | null;
  invitedAt: Timestamp | null;
  joinedAt: Timestamp | null;
  deactivatedAt: Timestamp | null;
  activatedAt: Timestamp | null;
  groupUserStatus: GROUP_USER_STATUS;
  role: GROUP_USER_ROLE;
};
