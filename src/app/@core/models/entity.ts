import { Timestamp } from 'firebase/firestore';
import { UpdateInfo } from './update-info';

export type Entity = {
  id: string | null;
  creatorId: string;
  createdAt: Timestamp;
  isActive: boolean;
};
