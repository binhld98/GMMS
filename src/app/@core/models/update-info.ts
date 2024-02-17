import { Timestamp } from 'firebase/firestore';

export type UpdateInfo = {
  modifierId: string;
  modifiedAt: Timestamp;
  description: string;
};
