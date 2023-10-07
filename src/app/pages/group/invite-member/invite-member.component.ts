import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd/message';

import { GroupBusiness } from 'src/app/@core/businesses/group.business';
import { UserInGroupDto } from 'src/app/@core/dtos/group.dto';
import { SimpleUserDto } from 'src/app/@core/dtos/user.dto';

@Component({
  selector: 'gmm-invite-member',
  templateUrl: './invite-member.component.html',
  styleUrls: ['./invite-member.component.css'],
})
export class InviteMemberComponent implements OnInit {
  @Input() isVisible = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  isInviting = false;
  form!: FormGroup;
  isLoading = false;
  optionUsers: SimpleUserDto[] = [];
  @Input() disabledMemberIds: string[] = [];
  @Input() groupId = '';
  @Output() invitedSuccess = new EventEmitter<UserInGroupDto[]>();

  constructor(
    private fb: UntypedFormBuilder,
    private groupBusiness: GroupBusiness,
    private auth: Auth,
    private messageService: NzMessageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      userIds: [[], [Validators.required]],
    });
  }

  handleOk() {
    if (!this.form.valid) {
      Object.values(this.form.controls).forEach((control) => {
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
          this.groupId,
          this.form.value.userIds
        )
        .then((users) => {
          this.messageService.create('success', 'Mời tham gia nhóm thành công');
          this.invitedSuccess.next(users);
        })
        .finally(() => {
          this.isInviting = false;
          this.handleCancel();
        });
    }
  }

  handleCancel() {
    this.optionUsers = [];
    this.form.reset();
    this.isVisibleChange.emit(false);
  }

  onSearch(keyword: string) {
    if (keyword.length < 5) {
      return;
    }

    this.isLoading = true;
    this.groupBusiness.findUsersByNameOrEmail(keyword).then((users) => {
      this.optionUsers = users;
      this.isLoading = false;
    });
  }

  canSelect(u: SimpleUserDto): boolean {
    return this.disabledMemberIds.indexOf(u.userId) == -1;
  }
}
