import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
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
import { GroupMasterDto, GroupUserDto } from 'src/app/@core/dtos/group.dto';
import { GROUP_USER_STATUS } from 'src/app/@core/models/group-user';

@Component({
  selector: 'gmm-upsert-payment-modal',
  templateUrl: './upsert-payment.component.html',
  styleUrls: ['./upsert-payment.component.css'],
})
export class UpsertPaymentComponent implements OnInit, OnDestroy {
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
    private groupBusiness: GroupBusiness
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      groupId: [null, [Validators.required]],
      date: [new Date(), [Validators.required]],
      time: [new Date()],
      aSide: this.fb.array([]),
      bSide: this.fb.array([]),
    });
  }

  ngOnDestroy(): void {}

  private touchSelectGroup(): boolean {
    const groupId = this.form.value.groupId;
    if (!groupId) {
      this.members = [];
      this.messageService.warning('Hãy chọn nhóm trước');
      const control = <FormControl>this.form.get('groupId');
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
      return false;
    }

    return true;
  }

  get aSideFA() {
    return <FormArray>this.form.get('aSide');
  }

  get bSideFA() {
    return <FormArray>this.form.get('bSide');
  }

  onAddToASide() {
    if (this.touchSelectGroup()) {
      this.aSideFA.push(
        this.fb.group({
          userId: [null, [Validators.required]],
          amount: [null, [Validators.required]],
          description: [null, [Validators.required]],
        })
      );
    }
  }

  onAddToBSide() {
    if (this.touchSelectGroup()) {
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
    this.isVisibleChange.next(false);
  }

  onSave() {
    console.log(this.form);
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
        this.messageService.error('Có lỗi xảy ra, vui lòng thử lại sau');
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
    if (!this.touchSelectGroup()) {
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
        this.messageService.error('Có lỗi xảy ra, vui lòng thử lại sau');
      })
      .finally(() => {
        this.isAutoLoadBSide = false;
      });
  }

  autoLoadASide() {
    if (!this.touchSelectGroup()) {
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
        this.messageService.error('Có lỗi xảy ra, vui lòng thử lại sau');
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
        this.messageService.error('Có lỗi xảy ra, vui lòng thử lại sau');
      })
      .finally(() => {
        this.isLoadingMembers = false;
      });
  }

  onResetForm() {
    this.form.reset();
  }
}
