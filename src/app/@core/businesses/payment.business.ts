import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';

import { Timestamp } from 'firebase/firestore';

import { PAYMENT_STATUS } from '../constants/common.constant';

import { UpsertPaymentDto } from '../dtos/payment.dto';
import { CommonUtil } from '../utils/common.util';
import { Payment } from '../models/payment';
import { PaymentRepository } from '../repositories/payment.repository';

@Injectable()
export class PaymentBusiness {
  constructor(
    private storage: Storage,
    private paymentRepository: PaymentRepository
  ) {}

  async createNewPayment(
    dto: UpsertPaymentDto,
    userId: string
  ): Promise<string | null> {
    // storage
    const pdfRef = ref(
      this.storage,
      CommonUtil.getPaymentBasePath(dto.groupId) + dto.pdfName
    );
    const uploadResult = await uploadBytes(pdfRef, dto.pdfBlob);

    // firestore
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
      pdfPath: uploadResult.metadata.fullPath,
    } as Payment;

    const paymentAdded = await this.paymentRepository.addAsync(payment);
    if (!paymentAdded) {
      return null;
    }

    return paymentAdded.id;
  }
}
