import { Timestamp } from 'firebase/firestore';
import { Entity } from './entity';
import { PAYMENT_STATUS } from '../constants/common.constant';

export type Payment = Entity & {
  groupId: string;
  status: PAYMENT_STATUS;
  aSide: {
    userId: string;
    amount: number;
    description: string;
  }[];
  bSide: {
    userId: string;
  }[];
  paymentAt: Timestamp;
  olderHistory: PaymentHistory[] | [];
  lastHistory: PaymentHistory;
};

export type PaymentHistory = {
  userId: string;
  status: PAYMENT_STATUS;
  comment: string;
  modifiedAt: Timestamp;
};
