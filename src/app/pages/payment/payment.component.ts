import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { PaymentBusiness } from 'src/app/@core/businesses/payment.business';
import { CommonUtil } from 'src/app/@core/utils/common.util';
import { GroupMasterDto } from 'src/app/@core/dtos/group.dto';
import {
  FromToTypeDto,
  SearchPaymentParamsDto,
} from 'src/app/@core/dtos/payment.dto';

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
      fromToType: FromToTypeDto;
    };

    const _groupIds = formValue.groupId != '-1' ? [formValue.groupId] : null;
    const _fromDate = CommonUtil.startOfDate(formValue.fromDate);
    const _toDate = CommonUtil.endOfDate(formValue.toDate);

    const paramsDto = {
      groupIds: _groupIds,
      fromDate: _fromDate,
      toDate: _toDate,
      fromToType: formValue.fromToType,
    } as SearchPaymentParamsDto;
    this.isLoadingPayments = true;
    this.paymentBusiness
      .getPayments(paramsDto)
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.isLoadingPayments = false;
      });
  }
}
