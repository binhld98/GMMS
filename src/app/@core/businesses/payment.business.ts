import { Injectable } from '@angular/core';

import { Timestamp } from 'firebase/firestore';

import { PAYMENT_STATUS } from '../constants/common.constant';

import { SearchPaymentParamsDto, UpsertPaymentDto } from '../dtos/payment.dto';
import { Payment } from '../models/payment';
import { PaymentRepository } from '../repositories/payment.repository';
import { CommonUtil } from '../utils/common.util';

@Injectable()
export class PaymentBusiness {
  constructor(private paymentRepository: PaymentRepository) {}

  async createNewPayment(
    dto: UpsertPaymentDto,
    userId: string
  ): Promise<string | null> {
    const payment = {
      id: null,
      creatorId: userId,
      createdAt: Timestamp.now(),
      modifiedInfos: [],
      isActive: true,
      groupId: dto.groupId,
      status: PAYMENT_STATUS.WAIT_APPROVE,
      aSide: dto.aSide,
      bSide: dto.bSide,
      paymentAt: dto.paymentAt,
    } as Payment;

    const paymentAdded = await this.paymentRepository.addAsync(payment);
    if (!paymentAdded) {
      return null;
    }

    return paymentAdded.id;
  }

  async getPayments(params: SearchPaymentParamsDto) {
    const endOfCurrentDay = CommonUtil.dateTimeToTimestamp(
      new Date(),
      new Date(0, 0, 0, 23, 59, 59)
    );

    const payments = await this.paymentRepository.findManyAsync(
      params.groupIds,
      params.createdAtFrom,
      params.createdAtTo,
      params.paymentAtFrom,
      params.paymentAtTo
    );
    console.log(payments);
    return payments;
  }
}
