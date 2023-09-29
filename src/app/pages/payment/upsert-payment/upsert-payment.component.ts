import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
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

import { GroupBusiness } from 'src/app/@core/businesses/group.business';
import { PaymentBusiness } from 'src/app/@core/businesses/payment.business';
import { GroupMasterDto, GroupUserDto } from 'src/app/@core/dtos/group.dto';
import { GROUP_USER_STATUS } from 'src/app/@core/models/group-user';
import {
  PaymentPdfDto,
  UpsertPaymentDto,
} from 'src/app/@core/dtos/payment.dto';

import { CommonUtil } from 'src/app/@core/utils/common.util';
import { PdfUtil } from 'src/app/@core/utils/pdf.util';

@Component({
  selector: 'gmm-upsert-payment-modal',
  templateUrl: './upsert-payment.component.html',
  styleUrls: ['./upsert-payment.component.css'],
})
export class UpsertPaymentComponent implements OnInit, OnDestroy, OnChanges {
  @Input() isVisible = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  form!: FormGroup;
  isLoadingGroups = false;
  groups: GroupMasterDto[] | [] = [];
  isLoadingMembers = false;
  members: GroupUserDto[] | [] = [];
  isAutoLoadBSide = false;
  isAutoLoadASide = false;

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
      time: [new Date()],
      aSide: this.fb.array([], [Validators.required]),
      bSide: this.fb.array([], [Validators.required]),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const isVisible: boolean = changes['isVisible'].currentValue;
    if (isVisible) {
      this.form.reset({
        groupId: null,
        date: new Date(),
        time: new Date(),
        aSide: [],
        bSide: [],
      });
    }
  }

  ngOnDestroy(): void {}

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

  get aSideFA() {
    return <FormArray>this.form.get('aSide');
  }

  get bSideFA() {
    return <FormArray>this.form.get('bSide');
  }

  onAddToASide() {
    if (this.touchHeaderForm()) {
      this.aSideFA.push(
        this.fb.group({
          userId: [null, [Validators.required]],
          amount: [null, [Validators.min, Validators.max, Validators.required]],
          description: [null, [Validators.required]],
        })
      );
    }
  }

  onAddToBSide() {
    if (this.touchHeaderForm()) {
      this.bSideFA.push(
        this.fb.group({
          userId: [null, [Validators.required]],
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
    this.onResetForm();
    this.isVisibleChange.next(false);
  }

  onGeneratePayment() {
    if (!this.touchHeaderForm()) {
      return;
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
      return;
    }

    const _group = this.groups.find((g) => g.id == this.form.value.groupId)!;
    const _date = this.form.value.date as Date;
    const _time = this.form.value.time as Date;

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
      userName: string;
    }[];

    let _bSide = bSide.map((b: any) => {
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
      paymentAt: CommonUtil.dateTimeToTimestamp(_date, _time),
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

  onOpenSelectGroup(isOpen: boolean) {
    if (!isOpen || this.groups.length > 0) {
      return;
    }

    this.isLoadingGroups = true;
    this.groupBusiness
      .getJoinedGroupsByUserId(this.auth.currentUser!.uid)
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

  autoLoadBSide() {
    if (!this.touchHeaderForm()) {
      return;
    }

    if (this.members.length > 0) {
      this.bSideFA.clear();
      this.members.forEach((m) => {
        this.bSideFA.push(
          this.fb.group({
            userId: [m.userId, [Validators.required]],
          })
        );
      });
      return;
    }

    this.isAutoLoadBSide = true;
    this.groupBusiness
      .getGroupDetail(this.form.value.groupId)
      .then((g) => {
        if (!!g) {
          this.members = g.users.filter((u) => {
            return u.joinedStatus == GROUP_USER_STATUS.JOINED;
          });
        }
        this.bSideFA.clear();
        this.members.forEach((m) => {
          this.bSideFA.push(
            this.fb.group({
              userId: [m.userId, [Validators.required]],
            })
          );
        });
      })
      .catch((error) => {
        this.messageService.error(CommonUtil.COMMON_ERROR_MESSAGE);
      })
      .finally(() => {
        this.isAutoLoadBSide = false;
      });
  }

  autoLoadASide() {
    if (!this.touchHeaderForm()) {
      return;
    }

    if (this.members.length > 0) {
      this.aSideFA.clear();
      this.members.forEach((m) => {
        this.aSideFA.push(
          this.fb.group({
            userId: [m.userId, [Validators.required]],
            amount: [null, [Validators.required]],
            description: [null, [Validators.required]],
          })
        );
      });
      return;
    }

    this.isAutoLoadASide = true;
    this.groupBusiness
      .getGroupDetail(this.form.value.groupId)
      .then((g) => {
        if (!!g) {
          this.members = g.users.filter((u) => {
            return u.joinedStatus == GROUP_USER_STATUS.JOINED;
          });
        }
        this.aSideFA.clear();
        this.members.forEach((m) => {
          this.aSideFA.push(
            this.fb.group({
              userId: [m.userId, [Validators.required]],
              amount: [null, [Validators.required]],
              description: [null, [Validators.required]],
            })
          );
        });
      })
      .catch((error) => {
        this.messageService.error(CommonUtil.COMMON_ERROR_MESSAGE);
      })
      .finally(() => {
        this.isAutoLoadASide = false;
      });
  }

  onOpenSelectMember(isOpen: boolean) {
    if (!isOpen || this.members.length > 0) {
      return;
    }

    this.isLoadingMembers = true;
    this.groupBusiness
      .getGroupDetail(this.form.value.groupId)
      .then((g) => {
        if (!!g?.users) {
          this.members = g.users.filter((u) => {
            return u.joinedStatus == GROUP_USER_STATUS.JOINED;
          });
        }
      })
      .catch((error) => {
        this.messageService.error(CommonUtil.COMMON_ERROR_MESSAGE);
      })
      .finally(() => {
        this.isLoadingMembers = false;
      });
  }

  onResetForm() {
    this.form.reset();
  }

  /**
   *
   * Payment Pdf
   *
   */
  isVisiblePdf = false;
  isLoadingPdf = false;
  pdfBlob: Blob | null = null;
  pdfObjUrl: string = '';
  isSavingPayment = false;

  onSavePayment() {
    this.isSavingPayment = true;

    const _date = this.form.value.date as Date;
    const _time = this.form.value.time as Date;

    const dto = {
      groupId: this.form.value.groupId,
      aSide: this.form.value.aSide,
      bSide: this.form.value.bSide,
      paymentAt: CommonUtil.dateTimeToTimestamp(_date, _time),
      pdfBlob: this.pdfBlob,
    } as UpsertPaymentDto;

    this.paymentBusiness
      .createNewPayment(dto, this.auth.currentUser!.uid)
      .then((paymentId) => {
        if (!!paymentId) {
          this.messageService.success('Tạo phiếu chi thành công!');
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
