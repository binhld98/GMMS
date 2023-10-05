import { Injectable } from '@angular/core';
import { Timestamp, serverTimestamp } from '@angular/fire/firestore';

import { PAYMENT_STATUS } from '../constants/common.constant';

import {
  SearchPaymentParamsDto,
  SearchPaymentResultDto,
  UpsertPaymentDto,
} from '../dtos/payment.dto';
import { Payment } from '../models/payment';
import { PaymentRepository } from '../repositories/payment.repository';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class PaymentBusiness {
  constructor(
    private paymentRepository: PaymentRepository,
    private userRepository: UserRepository
  ) {}

  private mapToPayment(
    dto: UpsertPaymentDto,
    userId: string,
    status: PAYMENT_STATUS
  ) {
    return {
      id: null,
      creatorId: userId,
      createdAt: serverTimestamp(),
      isActive: true,
      groupId: dto.groupId,
      status: status,
      aSide: dto.aSide,
      bSide: dto.bSide,
      paymentAt: Timestamp.fromDate(dto.paymentAt),
      olderHistory: [],
      lastHistory: {
        userId: userId,
        status: status,
        comment: dto.comment,
        modifiedAt: serverTimestamp(),
      },
    } as Payment;
  }

  async createWaitAprrovePayment(
    dto: UpsertPaymentDto,
    userId: string
  ): Promise<string | null> {
    const payment = this.mapToPayment(dto, userId, PAYMENT_STATUS.WAIT_APPROVE);
    const paymentAdded = await this.paymentRepository.addAsync(payment);
    if (!paymentAdded) {
      return null;
    }

    return paymentAdded.id;
  }

  async createDraftPayment(
    dto: UpsertPaymentDto,
    userId: string
  ): Promise<string | null> {
    const payment = this.mapToPayment(dto, userId, PAYMENT_STATUS.DRAFT);
    const paymentAdded = await this.paymentRepository.addAsync(payment);
    if (!paymentAdded) {
      return null;
    }

    return paymentAdded.id;
  }

  async getPayments(params: SearchPaymentParamsDto) {
    // validate params
    if (
      !params.groups.length ||
      params.fromDate.getTime() > params.toDate.getTime()
    ) {
      throw new Error('malformed params');
    }

    // search payments
    let payments: Payment[] = [];
    if (params.fromToType == 'created_at') {
      payments = await this.paymentRepository.findByCreatedAtRangeAsync(
        params.groups.map((g) => g.id),
        Timestamp.fromDate(params.fromDate),
        Timestamp.fromDate(params.toDate)
      );
    } else if (params.fromToType == 'payment_at') {
      payments = await this.paymentRepository.findByPaymentAtRangeAsync(
        params.groups.map((g) => g.id),
        Timestamp.fromDate(params.fromDate),
        Timestamp.fromDate(params.toDate)
      );
    }

    // process results
    if (!payments.length) {
      return [];
    }
    const userIds = payments.map((p) => p.creatorId);
    const creators = await this.userRepository.getManyAsync(userIds);

    const searchResult = payments.map((p) => {
      const group = params.groups.find((g) => g.id == p.groupId)!;
      const creator = creators.find((u) => u.id == p.creatorId)!;
      const totalAmount = p.aSide.reduce((total, current) => {
        return total + +current.amount;
      }, 0);

      return {
        groupId: p.groupId,
        groupName: group.groupName,
        creatorId: p.creatorId,
        creatorName: creator.userName,
        createdAt: p.createdAt.toDate(),
        paymentAt: p.paymentAt.toDate(),
        totalAmount: totalAmount,
        status: p.status,
      } as SearchPaymentResultDto;
    });

    return searchResult;
  }
}
