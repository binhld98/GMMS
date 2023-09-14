import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { GroupBusiness } from 'src/app/@core/businesses/group.business';
import { UserDto } from 'src/app/@core/dtos/user.dto';

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
  optUsrs: UserDto[] | [] = [];

  constructor(
    private fb: UntypedFormBuilder,
    private groupBusiness: GroupBusiness
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      members: [null, [Validators.required]],
    });
  }

  ngOnDestroy(): void {}

  handleOk() {
    console.log(this.validateForm.value);
  }

  handleCancel() {
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
}
