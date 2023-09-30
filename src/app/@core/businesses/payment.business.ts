import { Injectable } from '@angular/core';
import { Timestamp, serverTimestamp } from '@angular/fire/firestore';

import { PAYMENT_STATUS } from '../constants/common.constant';

import { SearchPaymentParamsDto, UpsertPaymentDto } from '../dtos/payment.dto';
import { Payment } from '../models/payment';
import { PaymentRepository } from '../repositories/payment.repository';

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
      createdAt: serverTimestamp(),
      modifiedInfos: [],
      isActive: true,
      groupId: dto.groupId,
      status: PAYMENT_STATUS.WAIT_APPROVE,
      aSide: dto.aSide,
      bSide: dto.bSide,
      paymentAt: Timestamp.fromDate(dto.paymentAt),
    } as Payment;

    const paymentAdded = await this.paymentRepository.addAsync(payment);
    if (!paymentAdded) {
      return null;
    }

    return paymentAdded.id;
  }

  async getPayments(params: SearchPaymentParamsDto) {
    let payments: Payment[] = [];
    if (params.fromToType == 'created_at') {
      payments = await this.paymentRepository.findByCreatedAtRangeAsync(
        params.groupIds,
        Timestamp.fromDate(params.fromDate),
        Timestamp.fromDate(params.toDate)
      );
    } else if (params.fromToType == 'payment_at') {
      payments = await this.paymentRepository.findByPaymentAtRangeAsync(
        params.groupIds,
        Timestamp.fromDate(params.fromDate),
        Timestamp.fromDate(params.toDate)
      );
    }

    return payments;
  }
}
