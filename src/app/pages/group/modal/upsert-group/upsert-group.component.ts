import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';

import { GroupBusiness } from 'src/app/@core/businesses/group.business';

@Component({
  selector: 'app-upsert-group',
  templateUrl: './upsert-group.component.html',
  styleUrls: ['./upsert-group.component.css'],
})
export class UpsertGroupComponent implements OnInit, OnDestroy {
  @Input() isVisible = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  @Output() groupSaved = new EventEmitter<boolean>();

  validateForm!: UntypedFormGroup;
  isSaving = false;
  createGroupSubscription = new Subscription();

  constructor(
    private auth: Auth,
    private fb: UntypedFormBuilder,
    private groupBusiness: GroupBusiness,
    private messageService: NzMessageService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      groupName: [null, [Validators.required]],
      groupDescription: [],
    });
  }

  ngOnDestroy(): void {
    this.createGroupSubscription.unsubscribe();
  }

  handleOk() {
    if (!this.validateForm.valid) {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    } else {
      this.isSaving = true;
      const formValue = this.validateForm.value;
      const userId = this.auth.currentUser!.uid;
      this.createGroupSubscription = this.groupBusiness
        .createNewGroup(formValue.groupName, formValue.groupDescription, userId)
        .subscribe((x) => {
          if (!!x) {
            this.messageService.create('success', 'Tạo nhóm mới thành công');
            this.groupSaved.emit(true);
            this.validateForm.reset();
          } else {
            this.messageService.create('error', 'Không thể tạo được nhóm mới');
          }
          this.handleCancel();
          this.isSaving = false;
        });
    }
  }

  handleCancel() {
    this.isVisibleChange.emit(false);
  }
}
