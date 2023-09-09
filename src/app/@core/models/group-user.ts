export type GroupUser = {
  groupId: string,
  userId: string,
  invitorId: string,
  invitedAt: Date,
  joinedAt: Date,
  status: GROUP_USER_STATUS
}

export enum GROUP_USER_STATUS {
  
}