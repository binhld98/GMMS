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

import { PAYMENT_STATUS } from 'src/app/@core/constants/common.constant';
import { CommonUtil } from 'src/app/@core/utils/common.util';
import { GroupBusiness } from 'src/app/@core/businesses/group.business';
import { PaymentBusiness } from 'src/app/@core/businesses/payment.business';
import { ColumnFilterSorterConfig } from 'src/app/@core/dtos/common.dto';
import {
  FromToTypeDto,
  SearchPaymentParamsDto,
  SearchPaymentResultDto,
} from 'src/app/@core/dtos/payment.dto';
import { PaymentStatusPipe } from 'src/app/@core/pipes/payment.pipe';
import { GroupInUserDto } from 'src/app/@core/dtos/group.dto';

@Component({
  selector: 'gmm-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit, OnDestroy {
  app_h$_sub = new Subscription();

  // Card
  isLoadingCard = false;
  form!: FormGroup;
  groups: GroupInUserDto[] = [];

  // Table
  isLoadingTable = false;
  rowsObservable$ = new Subject<SearchPaymentResultDto[]>();
  rowsSubscription$ = new Subscription();
  rows: SearchPaymentResultDto[] = [];
  columnsConfig: ColumnFilterSorterConfig<SearchPaymentResultDto> = {
    groupName: {
      showFilter: true,
      filterMultiple: true,
      filterOptions: [],
      filterFunction: (list: string[], item: SearchPaymentResultDto) => {
        return list.some((name) => item.groupName.indexOf(name) !== -1);
      },
      showSort: false,
      sortPriority: false,
      sortOrder: null,
      sortFunction: null,
      sortDirections: [],
    },
    creatorName: {
      showFilter: true,
      filterMultiple: true,
      filterOptions: [],
      filterFunction: (list: string[], item: SearchPaymentResultDto) => {
        return list.some((name) => item.creatorName.indexOf(name) !== -1);
      },
      showSort: false,
      sortPriority: false,
      sortOrder: null,
      sortFunction: null,
      sortDirections: [],
    },
    createdAt: {
      showFilter: false,
      filterMultiple: false,
      filterOptions: [],
      filterFunction: null,
      showSort: true,
      sortPriority: false,
      sortOrder: null,
      sortFunction: (a: SearchPaymentResultDto, b: SearchPaymentResultDto) => {
        return a.createdAt.getTime() - b.createdAt.getTime();
      },
      sortDirections: [],
    },
    paymentAt: {
      showFilter: false,
      filterMultiple: false,
      filterOptions: [],
      filterFunction: null,
      showSort: true,
      sortPriority: false,
      sortOrder: null,
      sortFunction: (a: SearchPaymentResultDto, b: SearchPaymentResultDto) => {
        return a.paymentAt.getTime() - b.paymentAt.getTime();
      },
      sortDirections: [],
    },
    totalAmount: {
      showFilter: false,
      filterMultiple: false,
      filterOptions: [],
      filterFunction: null,
      showSort: true,
      sortPriority: false,
      sortOrder: null,
      sortFunction: (a: SearchPaymentResultDto, b: SearchPaymentResultDto) => {
        return a.totalAmount - b.totalAmount;
      },
      sortDirections: [],
    },
    status: {
      showFilter: true,
      filterMultiple: true,
      filterOptions: [],
      filterFunction: (
        list: PAYMENT_STATUS[],
        item: SearchPaymentResultDto
      ) => {
        return list.some((status) => item.status == status);
      },
      showSort: false,
      sortPriority: -1,
      sortOrder: null,
      sortFunction: null,
      sortDirections: [],
    },
  };
  tableScroll: { x?: string; y?: string } = {};

  // Modals
  isVisibleCreate = false;
  isVisibleEdit = false;
  paymentIdForEdit = '';

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
    // window resize
    this.app_h$_sub = this.appService.h$.subscribe((h) => {
      this.tableScroll = {
        y: h - 428 + 'px',
      };
    });

    this.isLoadingCard = true;

    // 1) card - search form
    const now = new Date();
    const fromDate = CommonUtil.startOfDate(
      new Date(now.getFullYear(), now.getMonth(), 1)
    );
    const toDate = CommonUtil.endOfDate(
      new Date(now.getFullYear(), now.getMonth() + 1, 0)
    );
    this.form = this.fb.group({
      fromToType: ['payment_at', [Validators.required]],
      fromDate: [fromDate, [Validators.required]],
      toDate: [toDate, [Validators.required]],
    });

    // 2) card - table
    this.rowsSubscription$ = this.rowsObservable$.subscribe((payments) => {
      this.rows = payments;

      // group name
      const groupNameFilterOpts = this.rows
        .map((r) => ({
          text: r.groupName,
          value: r.groupName,
        }))
        .sort((a, b) => a.text.localeCompare(b.text));
      this.columnsConfig['groupName'].filterOptions = CommonUtil.arrayDistinct(
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
      this.columnsConfig['creatorName'].filterOptions =
        CommonUtil.arrayDistinct(creatorNameFilterOpts, 'text');

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
      this.columnsConfig['status'].filterOptions = CommonUtil.arrayDistinct(
        statusFilterOpts,
        'value'
      );
    });

    this.groupBusiness
      .getListGroupInUser(this.auth.currentUser!.uid)
      .then((g) => {
        this.groups = g;
        const paramsDto = {
          groups: this.groups,
          fromDate: fromDate,
          toDate: toDate,
          fromToType: 'payment_at',
        } as SearchPaymentParamsDto;
        this.paymentBusiness
          .searchPayments(paramsDto)
          .then((payments) => {
            this.rowsObservable$.next(payments);
          })
          .catch((error) => {
            this.messageService.error(CommonUtil.COMMON_ERROR_MESSAGE);
          })
          .finally(() => {
            this.isLoadingCard = false;
          });
      });
  }

  ngOnDestroy(): void {
    this.rowsSubscription$.unsubscribe();
  }

  onAddPayment() {
    this.isVisibleCreate = true;
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
    const paramsDto = {
      groups: this.groups,
      fromDate: CommonUtil.startOfDate(formValue.fromDate),
      toDate: CommonUtil.endOfDate(formValue.toDate),
      fromToType: formValue.fromToType,
    } as SearchPaymentParamsDto;

    this.isLoadingTable = true;
    this.paymentBusiness
      .searchPayments(paramsDto)
      .then((payments) => {
        this.rowsObservable$.next(payments);
      })
      .catch((error) => {
        this.messageService.error(CommonUtil.COMMON_ERROR_MESSAGE);
      })
      .finally(() => {
        this.isLoadingTable = false;
      });
  }

  canEditPayment(data: SearchPaymentResultDto) {
    return (
      (data.status == PAYMENT_STATUS.DRAFT ||
        data.status == PAYMENT_STATUS.REJECTED) &&
      data.creatorId == this.auth.currentUser!.uid
    );
  }

  onEditPayment(data: SearchPaymentResultDto) {
    this.paymentIdForEdit = data.paymentId;
    this.isVisibleEdit = true;
  }
}
