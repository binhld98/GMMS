import { Timestamp } from 'firebase/firestore';

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
