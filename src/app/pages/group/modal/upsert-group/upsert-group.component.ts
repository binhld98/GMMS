import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-upsert-group',
  templateUrl: './upsert-group.component.html',
  styleUrls: ['./upsert-group.component.css'],
})
export class UpsertGroupComponent implements OnInit {
  @Input() isVisible = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  validateForm!: UntypedFormGroup;

  isSaving = false;

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      groupName: [null, [Validators.required]],
      groupDescription: [],
    });
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

      //this.handleCancel();
    }
  }

  handleCancel() {
    this.isVisibleChange.emit(false);
  }
}
