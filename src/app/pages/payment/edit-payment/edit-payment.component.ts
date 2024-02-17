import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Auth } from '@angular/fire/auth';

import { NzMessageService } from 'ng-zorro-antd/message';

import { GROUP_USER_STATUS } from 'src/app/@core/constants/common.constant';
import { CommonUtil } from 'src/app/@core/utils/common.util';
import { PdfUtil } from 'src/app/@core/utils/pdf.util';
import { GroupBusiness } from 'src/app/@core/businesses/group.business';
import { PaymentBusiness } from 'src/app/@core/businesses/payment.business';
import {
  PaymentPdfDto,
  UpsertPaymentDto,
} from 'src/app/@core/dtos/payment.dto';
import { GroupInUserDto, UserInGroupDto } from 'src/app/@core/dtos/group.dto';

@Component({
  selector: 'gmm-edit-payment-modal',
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.css'],
})
export class EditPaymentComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Input() paymentId = '';
  isLoadingCard = false;
  form!: FormGroup;
  isLoadingGroups = false;
  groups: GroupInUserDto[] = [];
  isLoadingMembers = false;
  members: UserInGroupDto[] = [];
  isAutoLoadBSide = false;
  isAutoLoadASide = false;
  adminComment = '';

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private messageService: NzMessageService,
    private groupBusiness: GroupBusiness,
    private paymentBusiness: PaymentBusiness
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      groupId: [null, [Validators.required]],
      date: [new Date(), [Validators.required]],
      time: [null],
      comment: [null],
      aSide: this.fb.array([], [Validators.required]),
      bSide: this.fb.array([], [Validators.required]),
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (
      changes['paymentId'] &&
      !!changes['paymentId'].currentValue &&
      changes['paymentId'] &&
      !!changes['paymentId'].currentValue
    ) {
      this.isLoadingCard = true;

      // loading data
      const payment = await this.paymentBusiness.getUpsertPayment(
        changes['paymentId'].currentValue
      );
      if (!payment) {
        this.messageService.error(CommonUtil.COMMON_ERROR_MESSAGE);
        return;
      }

      this.groups = await this.groupBusiness.getListGroupInUser(
        this.auth.currentUser!.uid
      );

      const users = await this.groupBusiness.getListUserInGroup(
        payment.groupId
      );
      if (users.length <= 0) {
        this.messageService.error(CommonUtil.COMMON_ERROR_MESSAGE);
        return;
      }
      const members = users.filter(
        (u) => u.groupUserStatus != GROUP_USER_STATUS.INVITED
      );

      // filling form
      this.form.get('groupId')!.setValue(payment.groupId);
      this.form.get('date')!.setValue(payment.paymentAt);
      this.form.get('time')!.setValue(payment.paymentAt);
      this.adminComment = payment.comment;
      this.members = members;
      payment.aSide.forEach((s) => {
        this.onAddToASide(s.userId, s.amount, s.description);
      });
      payment.bSide.forEach((s) => {
        this.onAddToBSide(s.userId);
      });

      this.isLoadingCard = false;
    }
  }

  private touchHeaderForm(): boolean {
    let valid = true;

    if (!this.form.value.groupId) {
      this.members = [];
      const c = <FormControl>this.form.get('groupId');
      c.markAsDirty();
      c.updateValueAndValidity({ onlySelf: true });
      valid = false;
    }

    if (!this.form.value.date) {
      const c = <FormControl>this.form.get('date');
      c.markAsDirty();
      c.updateValueAndValidity({ onlySelf: true });
      valid = false;
    }

    return valid;
  }

  malformedMoney(control: FormControl): { [key: string]: any } | null {
    if (!!control.value) {
      const amount = parseFloat(control.value);
      if (amount == control.value) {
        if (0 < amount && amount < 999999) {
          return null;
        }
      }
    }

    return { malformedMoney: true };
  }

  get aSideFA() {
    return <FormArray>this.form.get('aSide');
  }

  get bSideFA() {
    return <FormArray>this.form.get('bSide');
  }

  onAddToASide(
    userId: string | null = null,
    amount: number | null = null,
    description: string | null = null
  ) {
    if (this.touchHeaderForm()) {
      this.aSideFA.push(
        this.fb.group({
          userId: [userId, [Validators.required]],
          amount: [amount, [this.malformedMoney.bind(this)]],
          description: [description, [Validators.required]],
        })
      );
    }
  }

  onAddToBSide(userId: string | null = null) {
    if (this.touchHeaderForm()) {
      this.bSideFA.push(
        this.fb.group({
          userId: [userId, [Validators.required]],
        })
      );
    }
  }

  removeFromASide(index: number) {
    this.aSideFA.removeAt(index);
  }

  removeFromBSide(index: number) {
    this.bSideFA.removeAt(index);
  }

  handleCancel() {
    this.isVisibleChange.next(false);
  }

  private touchFullForm() {
    if (!this.touchHeaderForm()) {
      return false;
    }

    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((c) => {
        if (c instanceof FormArray) {
          c.markAsTouched();
          Object.values(c.controls).forEach((_c) => {
            if (_c instanceof FormGroup) {
              Object.values(_c.controls).forEach((__c) => {
                if (__c.invalid) {
                  __c.markAsDirty();
                  __c.updateValueAndValidity({ onlySelf: true });
                }
              });
            }
          });
        } else if (c.invalid) {
          c.markAsDirty();
          c.updateValueAndValidity({ onlySelf: true });
        }
      });
      return false;
    }

    return true;
  }

  onOpenSelectGroup(isOpen: boolean) {
    if (!isOpen || this.groups.length > 0) {
      return;
    }

    this.isLoadingGroups = true;
    this.groupBusiness
      .getListGroupInUser(this.auth.currentUser!.uid)
      .then((g) => {
        this.groups = g;
      })
      .catch((error) => {
        this.messageService.error(CommonUtil.COMMON_ERROR_MESSAGE);
      })
      .finally(() => {
        this.isLoadingGroups = false;
      });
  }

  onChangeSelectGroup(groupId: string) {
    this.aSideFA.clear();
    this.bSideFA.clear();
    this.members = [];
  }

  autoLoadASide() {
    if (!this.touchHeaderForm()) {
      return;
    }

    if (this.members.length <= 0) {
      throw new Error('empty members');
    }

    this.aSideFA.clear();
    this.members.forEach((m) => this.onAddToASide(m.userId, null, null));
  }

  autoLoadBSide() {
    if (!this.touchHeaderForm()) {
      return;
    }

    if (this.members.length <= 0) {
      throw new Error('empty members');
    }

    this.bSideFA.clear();
    this.members.forEach((m) => this.onAddToBSide(m.userId));
  }

  onResetForm() {
    this.form.reset();
  }

  /**
   *
   * Payment Pdf
   *
   */

  private getUpsertDtoForSave(): UpsertPaymentDto {
    const _date = this.form.value.date as Date;
    let _time = this.form.value.time as Date;
    if (!_time) {
      _time = new Date(0, 0, 0, 0, 0, 0, 0);
    }

    const bSide = this.form.value.bSide as {
      userId: string;
    }[];

    const _bSide = [
      ...new Map(bSide.map((item) => [item.userId, item])).values(),
    ];

    return {
      groupId: this.form.value.groupId,
      aSide: this.form.value.aSide,
      bSide: _bSide,
      paymentAt: CommonUtil.combineDateTime(_date, _time),
      comment: this.form.value.comment,
    };
  }

  isVisiblePdf = false;
  isLoadingPdf = false;
  pdfBlob: Blob | null = null;
  pdfObjUrl: string = '';
  isSavingPayment = false;
  @Output() paymentSaved = new EventEmitter<void>();

  onGeneratePayment() {
    if (!this.touchFullForm()) {
      return;
    }

    const _group = this.groups.find(
      (g) => g.groupId == this.form.value.groupId
    )!;
    const _date = this.form.value.date as Date;
    let _time = this.form.value.time as Date;
    if (!_time) {
      _time = new Date(0, 0, 0, 0, 0, 0);
    }

    const aSide = this.form.value.aSide as {
      userId: string;
      amount: number;
      description: string;
    }[];

    let _aSide = aSide.map((a) => {
      const member = this.members.find((m) => m.userId == a.userId)!;
      return {
        userName: member.userName,
        amount: a.amount,
        description: a.description,
      };
    });

    _aSide = _aSide.sort((a, b) => {
      return a.userName.localeCompare(b.userName);
    });

    const bSide = this.form.value.bSide as {
      userId: string;
    }[];

    let _bSide = bSide.map((b) => {
      const member = this.members.find((m) => m.userId == b.userId)!;
      return {
        userName: member.userName,
      };
    });

    _bSide = [
      ...new Map(_bSide.map((item) => [item.userName, item])).values(),
    ].sort((a, b) => {
      return a.userName.localeCompare(b.userName);
    });

    const dto = {
      groupName: _group.groupName,
      paymentAt: CommonUtil.combineDateTime(_date, _time),
      aSide: _aSide,
      bSide: _bSide,
    } as PaymentPdfDto;
    this.isLoadingPdf = true;
    PdfUtil.makePaymentPdf(dto)
      .then((blob) => {
        this.pdfBlob = blob;
        this.pdfObjUrl = window.URL.createObjectURL(this.pdfBlob);
        this.isVisiblePdf = true;
      })
      .catch((error) => {
        this.messageService.error(CommonUtil.COMMON_ERROR_MESSAGE);
      })
      .finally(() => {
        this.isLoadingPdf = false;
      });
  }

  onSavePayment() {
    this.isSavingPayment = true;
    this.paymentBusiness
      .createWaitAprrovePayment(
        this.getUpsertDtoForSave(),
        this.auth.currentUser!.uid
      )
      .then((paymentId) => {
        if (!!paymentId) {
          this.messageService.success('Cập nhật phiếu chi thành công!');
          this.paymentSaved.emit();
        } else {
          this.messageService.error(CommonUtil.COMMON_ERROR_MESSAGE);
        }
      })
      .catch((error) => {
        this.messageService.error(CommonUtil.COMMON_ERROR_MESSAGE);
      })
      .finally(() => {
        this.isSavingPayment = false;
        this.isVisiblePdf = false;
        this.handleCancel();
      });
  }
}
