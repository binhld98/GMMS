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

import { Subscription } from 'rxjs';

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
  optUsrsSub = new Subscription();

  constructor(
    private fb: UntypedFormBuilder,
    private groupBusiness: GroupBusiness
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      members: [null, [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    this.optUsrsSub.unsubscribe();
  }

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
    this.optUsrsSub.unsubscribe();
    this.optUsrsSub = this.groupBusiness
      .findUsersByNameOrEmail(keyword)
      .subscribe((x) => {
        this.optUsrs = x;
        this.isLoading = false;
      });
  }
}
