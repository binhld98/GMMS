import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
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

@Component({
  selector: 'gmm-upsert-group-modal',
  templateUrl: './upsert-group.component.html',
  styleUrls: ['./upsert-group.component.css'],
})
export class UpsertGroupComponent implements OnInit, OnDestroy {
  @Input() isVisible = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  @Output() groupSaved = new EventEmitter<boolean>();

  validateForm!: UntypedFormGroup;
  isSaving = false;

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
      this.isSaving = true;
      const formValue = this.validateForm.value;
      const userId = this.auth.currentUser!.uid;
      this.groupBusiness
        .createNewGroup(formValue.groupName, formValue.groupDescription, userId)
        .then((groupId) => {
          if (!!groupId) {
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
