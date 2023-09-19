import { Timestamp } from 'firebase/firestore';
import { Entity } from './entity';

export interface Payment extends Entity {
  groupId: string;
  status: PAYMENT_STATUS;
  aSide: ASide[];
  bSide: BSide[];
  paymentAt: Timestamp;
}

export enum PAYMENT_STATUS {
  APPROVED = 1,
  WAIT_APPROVE = 2,
  SETTLED = 3,
  DRAFT = 4,
}

export type ASide = {
  userId: string;
  amount: number;
  description: string;
};

export type BSide = {
  userId: string;
};
