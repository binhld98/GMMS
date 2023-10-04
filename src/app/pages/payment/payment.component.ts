import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Auth } from '@angular/fire/auth';

import { Subject, Subscription } from 'rxjs';

import { AppService } from 'src/app/app.service';
import { NzMessageService } from 'ng-zorro-antd/message';

import {
  GROUP_USER_STATUS,
  PAYMENT_STATUS,
} from 'src/app/@core/constants/common.constant';
import { CommonUtil } from 'src/app/@core/utils/common.util';
import { GroupBusiness } from 'src/app/@core/businesses/group.business';
import { PaymentBusiness } from 'src/app/@core/businesses/payment.business';
import { ColumnFilterSorterConfig } from 'src/app/@core/dtos/common.dto';
import { GroupMasterDto } from 'src/app/@core/dtos/group.dto';
import {
  FromToTypeDto,
  SearchPaymentParamsDto,
  SearchPaymentResultDto,
} from 'src/app/@core/dtos/payment.dto';
import { PaymentStatusPipe } from 'src/app/@core/pipes/payment.pipe';

@Component({
  selector: 'gmm-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit, OnDestroy {
  isInitiating = false;
  isVisibleUpsert = false;
  form!: FormGroup;
  isLoadingPayments = false;
  groups: GroupMasterDto[] = [];
  joinedGroups: GroupMasterDto[] = [];

  // Table
  rowsObs = new Subject<SearchPaymentResultDto[]>();
  rowsSub = new Subscription();
  rows: SearchPaymentResultDto[] = [];
  colConf: ColumnFilterSorterConfig<SearchPaymentResultDto> = {
    groupName: {
      showFilter: true,
      multiFilter: true,
      filterOpts: [],
      filterFn: (list: string[], item: SearchPaymentResultDto) => {
        return list.some((name) => item.groupName.indexOf(name) !== -1);
      },
      showSort: false,
      sortPriority: false,
      sortOrder: null,
      sortFn: null,
      sortDirections: [],
    },
    creatorName: {
      showFilter: true,
      multiFilter: true,
      filterOpts: [],
      filterFn: (list: string[], item: SearchPaymentResultDto) => {
        return list.some((name) => item.creatorName.indexOf(name) !== -1);
      },
      showSort: false,
      sortPriority: false,
      sortOrder: null,
      sortFn: null,
      sortDirections: [],
    },
    createdAt: {
      showFilter: false,
      multiFilter: false,
      filterOpts: [],
      filterFn: null,
      showSort: true,
      sortPriority: false,
      sortOrder: null,
      sortFn: (a: SearchPaymentResultDto, b: SearchPaymentResultDto) => {
        return a.createdAt.getTime() - b.createdAt.getTime();
      },
      sortDirections: [],
    },
    paymentAt: {
      showFilter: false,
      multiFilter: false,
      filterOpts: [],
      filterFn: null,
      showSort: true,
      sortPriority: false,
      sortOrder: null,
      sortFn: (a: SearchPaymentResultDto, b: SearchPaymentResultDto) => {
        return a.paymentAt.getTime() - b.paymentAt.getTime();
      },
      sortDirections: [],
    },
    totalAmount: {
      showFilter: false,
      multiFilter: false,
      filterOpts: [],
      filterFn: null,
      showSort: true,
      sortPriority: false,
      sortOrder: null,
      sortFn: (a: SearchPaymentResultDto, b: SearchPaymentResultDto) => {
        return a.totalAmount - b.totalAmount;
      },
      sortDirections: [],
    },
    status: {
      showFilter: true,
      multiFilter: true,
      filterOpts: [],
      filterFn: (list: PAYMENT_STATUS[], item: SearchPaymentResultDto) => {
        return list.some((status) => item.status == status);
      },
      showSort: false,
      sortPriority: -1,
      sortOrder: null,
      sortFn: null,
      sortDirections: [],
    },
  };
  tblScroll: { x?: string; y?: string } = {};
  app_h$_sub = new Subscription();

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private appService: AppService,
    private messageService: NzMessageService,
    private groupBusiness: GroupBusiness,
    private paymentBusiness: PaymentBusiness,
    private paymentStatusPipe: PaymentStatusPipe
  ) {}

  ngOnInit(): void {
    this.isInitiating = true;
    this._OnInitForm();
    this._OnInitTable().finally(() => {
      this.isInitiating = false;
    });

    this.app_h$_sub = this.appService.h$.subscribe((h) => {
      this.tblScroll = {
        y: h - 428 + 'px',
      };
    });
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

  private _OnInitTable(): Promise<void> {
    this.rowsSub = this.rowsObs.subscribe((payments) => {
      this.rows = payments;

      // group name
      const groupNameFilterOpts = this.rows
        .map((r) => ({
          text: r.groupName,
          value: r.groupName,
        }))
        .sort((a, b) => a.text.localeCompare(b.text));
      this.colConf['groupName'].filterOpts = CommonUtil.arrayDistinct(
        groupNameFilterOpts,
        'text'
      );

      // creator name
      const creatorNameFilterOpts = this.rows
        .map((r) => ({
          text: r.creatorName,
          value: r.creatorName,
        }))
        .sort((a, b) => a.text.localeCompare(b.text));
      this.colConf['creatorName'].filterOpts = CommonUtil.arrayDistinct(
        creatorNameFilterOpts,
        'text'
      );

      // status
      const statusFilterOpts = this.rows
        .map((r) => {
          const tag = this.paymentStatusPipe.transform(r.status);
          return {
            text: tag.text,
            value: r.status,
          };
        })
        .sort((a, b) => a.value.toString().localeCompare(b.value.toString()));
      this.colConf['status'].filterOpts = CommonUtil.arrayDistinct(
        statusFilterOpts,
        'value'
      );
    });

    return this.groupBusiness
      .getGroupsOfUserBy(this.auth.currentUser!.uid, [
        GROUP_USER_STATUS.JOINED,
        GROUP_USER_STATUS.DEACTIVATED,
      ])
      .then((groups) => {
        this.groups = groups;
        return this.onSearchPayments();
      });
  }

  ngOnDestroy(): void {
    this.rowsSub.unsubscribe();
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

    return this.paymentBusiness
      .getPayments(paramsDto)
      .then((payments) => {
        this.rowsObs.next(payments);
      })
      .catch((error) => {
        this.messageService.error(CommonUtil.COMMON_ERROR_MESSAGE);
      })
      .finally(() => {
        this.isLoadingPayments = false;
      });
  }
}
