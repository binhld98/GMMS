import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'gmm-invite-member',
  templateUrl: './invite-member.component.html',
  styleUrls: ['./invite-member.component.css'],
})
export class InviteMemberComponent implements OnInit {
  @Input() isVisible = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  isInviting = false;
  validateForm!: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      members: [null, [Validators.required]],
    });
  }

  handleOk() {
    this.handleCancel();
  }

  handleCancel() {
    this.isVisibleChange.emit(false);
  }
}
