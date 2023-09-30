import { Timestamp } from 'firebase/firestore';
import { PAYMENT_STATUS } from '../constants/common.constant';

export type PaymentPdfDto = {
  groupName: string;
  paymentAt: Timestamp;
  aSide: {
    userName: string;
    amount: number;
    description: string;
  }[];
  bSide: {
    userName: string;
  }[];
  // creatorName: string;
};

export type UpsertPaymentDto = {
  groupId: string;
  paymentAt: Timestamp;
  aSide: {
    userId: string;
    amount: number;
    description: string;
  }[];
  bSide: {
    userId: string;
  }[];
};

export type SearchPaymentParamsDto = {
  groupIds: string[];
  createdAtFrom: Timestamp;
  createdAtTo: Timestamp;
  paymentAtFrom: Timestamp;
  paymentAtTo: Timestamp;
};

export type SearchPaymentResultDto = {
  groupId: string;
  groupName: string;
  creatorId: string;
  creatorName: string;
  createdAt: Timestamp;
  paymentAt: Timestamp;
  totalAmount: number;
  status: PAYMENT_STATUS;
  aSide: {
    userId: string;
    userName: string;
    amount: number;
    description: string;
  }[];
  bSide: {
    userId: string;
    userName: string;
  }[];
}[];
