import { Timestamp } from "firebase/firestore";
import { UpdateInfo } from "./update-info";

export interface Entity {
  id: string | null;
  creatorId: string,
  createdAt: Timestamp,
  modifiedInfos: UpdateInfo[] | [],
  isActive: boolean
}