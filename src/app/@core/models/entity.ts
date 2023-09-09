import { UpdateInfo } from "./update-info";

export interface Entity {
  id: string;
  creatorId: number,
  createdAt: Date,
  modifiedInfos: UpdateInfo[],
  isActive: boolean
}