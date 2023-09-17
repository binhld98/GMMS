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

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private messageService: NzMessageService,
    private groupBusiness: GroupBusiness
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      groupId: [null, [Validators.required]],
      type: [2, [Validators.required]],
      date: [new Date(), [Validators.required]],
      time: [new Date()],
      aSide: this.fb.array([]),
      bSide: this.fb.array([]),
    });
  }

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

  removeFromASide(index: number) {
    this.aSideFA.removeAt(index);
  }

  get bSideFA() {
    return <FormArray>this.form.get('bSide');
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

  removeFromBSide(index: number) {
    this.bSideFA.removeAt(index);
  }

  ngOnDestroy(): void {}

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

    if (!!groupId && this.form.value.type == 2) {
      this.autoLoadBSide();
    }
  }

  onChangeSelectType(type: number) {
    if (!!this.form.value.groupId && type == 2) {
      this.autoLoadBSide();
    }
  }

  autoLoadBSide() {
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
        this.members = !!g ? g.users : [];
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

  onOpenSelectMember(isOpen: boolean) {
    if (!isOpen || this.members.length > 0) {
      return;
    }

    this.isLoadingMembers = true;
    this.groupBusiness
      .getGroupDetail(this.form.value.groupId)
      .then((g) => {
        this.members = !!g ? g.users : [];
      })
      .catch((error) => {
        this.messageService.error('Có lỗi xảy ra, vui lòng thử lại sau');
      })
      .finally(() => {
        this.isLoadingMembers = false;
      });
  }
}
