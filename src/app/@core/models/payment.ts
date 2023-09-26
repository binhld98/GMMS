import { Timestamp } from 'firebase/firestore';
import { Entity } from './entity';
import { PAYMENT_STATUS } from '../constants/common.constant';

export type Payment = Entity & {
  groupId: string;
  status: PAYMENT_STATUS;
  aSide: ASide[];
  bSide: BSide[];
  paymentAt: Timestamp;
};

export type ASide = {
  userId: string;
  amount: number;
  description: string;
};

export type BSide = {
  userId: string;
};
