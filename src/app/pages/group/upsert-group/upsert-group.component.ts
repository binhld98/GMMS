import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Output,
} from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

import { GroupBusiness } from 'src/app/@core/businesses/group.business';
import { GroupInUserDto } from 'src/app/@core/dtos/group.dto';

@Component({
  selector: 'gmm-upsert-group-modal',
  templateUrl: './upsert-group.component.html',
  styleUrls: ['./upsert-group.component.css'],
})
export class UpsertGroupComponent implements OnInit, OnDestroy {
  @Input() isVisible = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Output() groupSaved = new EventEmitter<GroupInUserDto>();
  form!: FormGroup;
  isSaving = false;

  constructor(
    private auth: Auth,
    private fb: FormBuilder,
    private groupBusiness: GroupBusiness,
    private messageService: NzMessageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      groupName: [null, [Validators.required]],
      groupDescription: [],
    });
  }

  ngOnDestroy(): void {}

  handleOk() {
    if (!this.form.valid) {
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    } else {
      this.isSaving = true;
      const formValue = this.form.value;
      const userId = this.auth.currentUser!.uid;
      this.groupBusiness
        .createNewGroup(formValue.groupName, formValue.groupDescription, userId)
        .then((group) => {
          this.messageService.create('success', 'Tạo nhóm mới thành công');
          this.groupSaved.emit(group);
          this.form.reset();
          this.handleCancel();
          this.isSaving = false;
        });
    }
  }

  handleCancel() {
    this.isVisibleChange.emit(false);
  }
}
