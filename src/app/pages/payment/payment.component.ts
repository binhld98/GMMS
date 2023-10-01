import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Auth } from '@angular/fire/auth';

import { Subject, Subscription } from 'rxjs';

import { NzMessageService } from 'ng-zorro-antd/message';
import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableSortFn,
  NzTableSortOrder,
} from 'ng-zorro-antd/table';

import { GROUP_USER_STATUS } from 'src/app/@core/constants/common.constant';
import { CommonUtil } from 'src/app/@core/utils/common.util';
import { GroupBusiness } from 'src/app/@core/businesses/group.business';
import { PaymentBusiness } from 'src/app/@core/businesses/payment.business';
import { GroupMasterDto } from 'src/app/@core/dtos/group.dto';
import {
  FromToTypeDto,
  SearchPaymentParamsDto,
  SearchPaymentResultDto,
} from 'src/app/@core/dtos/payment.dto';

@Component({
  selector: 'gmm-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit, OnDestroy {
  isVisibleUpsert = false;
  form!: FormGroup;
  isLoadingPayments = false;
  groups: GroupMasterDto[] = [];
  joinedGroups: GroupMasterDto[] = [];

  // Table
  paymentObs = new Subject<SearchPaymentResultDto[]>();
  paymentRowsSub = new Subscription();
  paymentColsSub = new Subscription();
  paymentRows: SearchPaymentResultDto[] = [];
  paymentCols: {
    groupName: {
      text: string;
      listOfFilter: NzTableFilterList | [];
      filterFn: NzTableFilterFn<SearchPaymentResultDto> | null;
      filterMultiple: boolean;
      sortOrder: NzTableSortOrder | null;
      sortFn: NzTableSortFn<SearchPaymentResultDto> | null;
      sortDirections: NzTableSortOrder[] | [];
    };
  } = {
    groupName: {
      text: 'Tên nhóm',
      listOfFilter: [],
      filterFn: (list: string[], item: SearchPaymentResultDto) =>
        list.some((name) => item.groupName == name),
      filterMultiple: true,
      sortOrder: null,
      sortFn: null,
      sortDirections: [],
    },
  };

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private messageService: NzMessageService,
    private groupBusiness: GroupBusiness,
    private paymentBusiness: PaymentBusiness
  ) {}

  ngOnInit(): void {
    this._OnInitForm();
    this._OnInitTable();
  }

  private _OnInitForm() {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    );

    this.form = this.fb.group({
      fromToType: ['payment_at', [Validators.required]],
      fromDate: [startOfCurrentMonth, [Validators.required]],
      toDate: [endOfCurrentMonth, [Validators.required]],
    });
  }

  private _OnInitTable() {
    this.paymentRowsSub = this.paymentObs.subscribe((payments) => {
      this.paymentRows = payments;
    });

    this.paymentColsSub = this.paymentObs.subscribe((payments) => {
      this.paymentCols.groupName.listOfFilter = payments.map((p) => ({
        text: p.groupName,
        value: p.groupName,
      }));
    });

    this.isLoadingPayments = true;
    this.groupBusiness
      .getGroupsOfUserBy(this.auth.currentUser!.uid, [
        GROUP_USER_STATUS.JOINED,
        GROUP_USER_STATUS.DEACTIVATED,
      ])
      .then((groups) => {
        this.groups = groups;
        this.onSearchPayments();
      })
      .finally(() => {
        this.isLoadingPayments = false;
      });
  }

  ngOnDestroy(): void {
    this.paymentRowsSub.unsubscribe();
    this.paymentColsSub.unsubscribe();
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
      fromDate: Date;
      toDate: Date;
      fromToType: FromToTypeDto;
    };
    const _fromDate = CommonUtil.startOfDate(formValue.fromDate);
    const _toDate = CommonUtil.endOfDate(formValue.toDate);

    const paramsDto = {
      groups: this.groups,
      fromDate: _fromDate,
      toDate: _toDate,
      fromToType: formValue.fromToType,
    } as SearchPaymentParamsDto;
    this.isLoadingPayments = true;
    this.paymentBusiness
      .getPayments(paramsDto)
      .then((payments) => {
        this.paymentObs.next(payments);
      })
      .catch((error) => {
        this.messageService.error(CommonUtil.COMMON_ERROR_MESSAGE);
      })
      .finally(() => {
        this.isLoadingPayments = false;
      });
  }
}
