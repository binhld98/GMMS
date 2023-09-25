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
};
