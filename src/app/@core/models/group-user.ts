import { Timestamp } from "firebase/firestore"

export type GroupUser = {
  groupId: string | null,
  userId: string,
  invitorId: string | null,
  invitedAt: Timestamp | null,
  joinedAt: Timestamp | null,
  status: GROUP_USER_STATUS
}

export enum GROUP_USER_STATUS {
  JOINED = 1,
}