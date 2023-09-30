import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { PaymentBusiness } from 'src/app/@core/businesses/payment.business';

import { GroupMasterDto } from 'src/app/@core/dtos/group.dto';
import { SearchPaymentParamsDto } from 'src/app/@core/dtos/payment.dto';
import { CommonUtil } from 'src/app/@core/utils/common.util';

@Component({
  selector: 'gmm-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  isVisibleUpsert = false;
  form!: FormGroup;
  isLoadingPayments = false;
  groups: GroupMasterDto[] = [];

  constructor(
    private fb: FormBuilder,
    private paymentBusiness: PaymentBusiness
  ) {}

  ngOnInit(): void {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    );

    this.form = this.fb.group({
      groupId: ['-1', [Validators.required]],
      fromToType: ['payment_at', [Validators.required]],
      fromDate: [startOfCurrentMonth, [Validators.required]],
      toDate: [endOfCurrentMonth, [Validators.required]],
    });
  }

  onAddPayment() {
    this.isVisibleUpsert = true;
  }

  onSearchPayments() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((c) => {
        if (c instanceof FormControl) {
          c.markAsDirty();
          c.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const formValue = this.form.value as {
      groupId: string;
      fromDate: Date;
      toDate: Date;
      fromToType: string;
    };

    const _groupIds = formValue.groupId != '-1' ? [formValue.groupId] : null;
    let _createdAtFrom: Timestamp = CommonUtil.getMinTimestamp();
    let _createdAtTo: Timestamp = CommonUtil.getMaxTimestamp();
    let _paymentAtFrom: Timestamp = CommonUtil.getMinTimestamp();
    let _paymentAtTo: Timestamp = CommonUtil.getMaxTimestamp();
    if (formValue.fromToType == 'created_at') {
      _createdAtFrom = CommonUtil.dateTimeToTimestamp(formValue.fromDate, null);
      _createdAtTo = CommonUtil.dateTimeToTimestamp(
        formValue.toDate,
        CommonUtil.getMaxDate()
      );
    } else if (formValue.fromToType == 'payment_at') {
      _paymentAtFrom = CommonUtil.dateTimeToTimestamp(formValue.fromDate, null);
      _paymentAtTo = CommonUtil.dateTimeToTimestamp(
        formValue.toDate,
        CommonUtil.getMaxDate()
      );
    }

    const paramsDto = {
      groupIds: _groupIds,
      createdAtFrom: _createdAtFrom,
      createdAtTo: _createdAtTo,
      paymentAtFrom: _paymentAtFrom,
      paymentAtTo: _paymentAtTo,
    } as SearchPaymentParamsDto;
    this.isLoadingPayments = true;
    this.paymentBusiness.getPayments(paramsDto).finally(() => {
      this.isLoadingPayments = false;
    });
  }
}
