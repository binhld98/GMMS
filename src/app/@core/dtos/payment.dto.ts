import { PAYMENT_STATUS } from '../constants/common.constant';
import { GroupInUserDto } from './group.dto';

export type PaymentPdfDto = {
  groupName: string;
  paymentAt: Date;
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
  paymentAt: Date;
  aSide: {
    userId: string;
    amount: number;
    description: string;
  }[];
  bSide: {
    userId: string;
  }[];
  comment: string;
};

export type SearchPaymentParamsDto = {
  groups: GroupInUserDto[];
  fromDate: Date;
  toDate: Date;
  fromToType: FromToTypeDto;
};

export type FromToTypeDto = 'created_at' | 'payment_at';

export type SearchPaymentResultDto = {
  paymentId: string;
  groupId: string;
  groupName: string;
  creatorId: string;
  creatorName: string;
  createdAt: Date;
  paymentAt: Date;
  totalAmount: number;
  status: PAYMENT_STATUS;
};
