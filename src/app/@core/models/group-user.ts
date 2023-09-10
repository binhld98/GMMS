export type GroupUser = {
  groupId: string | null,
  userId: string,
  invitorId: string | null,
  invitedAt: Date | null,
  joinedAt: Date | null,
  status: GROUP_USER_STATUS
}

export enum GROUP_USER_STATUS {
  JOINED = 1,
}