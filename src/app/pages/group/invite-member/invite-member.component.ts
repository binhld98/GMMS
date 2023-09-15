import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd/message';

import { GroupBusiness } from 'src/app/@core/businesses/group.business';
import { InviteUserDto } from 'src/app/@core/dtos/user.dto';

@Component({
  selector: 'gmm-invite-member',
  templateUrl: './invite-member.component.html',
  styleUrls: ['./invite-member.component.css'],
})
export class InviteMemberComponent implements OnInit, OnDestroy {
  @Input() isVisible = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  isInviting = false;
  validateForm!: UntypedFormGroup;
  isLoading = false;
  optUsrs: InviteUserDto[] | [] = [];
  @Input() disabledMemberIds: string[] | [] = [];
  @Input() currentGroupId: string = '';
  @Output() invitedSuccess = new EventEmitter<void>();

  constructor(
    private fb: UntypedFormBuilder,
    private groupBusiness: GroupBusiness,
    private auth: Auth,
    private messageService: NzMessageService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      members: [[], [Validators.required]],
    });
    this.disabledMemberIds.find((id) => id == '');
  }

  ngOnDestroy(): void {}

  handleOk() {
    if (!this.validateForm.valid) {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    } else {
      this.isInviting = true;
      this.groupBusiness
        .inviteMembers(
          this.auth.currentUser!.uid,
          this.currentGroupId,
          this.validateForm.value.members
        )
        .then((isSuccess) => {
          if (isSuccess) {
            this.messageService.create(
              'success',
              'Mời tham gia nhóm thành công'
            );
          } else {
            this.messageService.create('error', 'Mời tham gia nhóm thất bại');
          }
          this.invitedSuccess.next();
        })
        .finally(() => {
          this.isInviting = false;
          this.handleCancel();
        });
    }
  }

  handleCancel() {
    this.optUsrs = [];
    this.validateForm.reset();
    this.isVisibleChange.emit(false);
  }

  onSearch(keyword: string) {
    if (keyword.length < 3) {
      return;
    }

    this.isLoading = true;
    this.groupBusiness.findUsersByNameOrEmail(keyword).then((users) => {
      this.optUsrs = users;
      this.isLoading = false;
    });
  }

  canSelect(u: InviteUserDto): boolean {
    if (this.disabledMemberIds.indexOf(<never>u.id) != -1) {
      return false;
    }

    return true;
  }
}
