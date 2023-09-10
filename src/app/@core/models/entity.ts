import { UpdateInfo } from "./update-info";

export interface Entity {
  id: string | null;
  creatorId: string,
  createdAt: Date,
  modifiedInfos: UpdateInfo[] | [],
  isActive: boolean
}