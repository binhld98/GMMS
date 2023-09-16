import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'gmm-upsert-payment-modal',
  templateUrl: './upsert-payment.component.html',
  styleUrls: ['./upsert-payment.component.css'],
})
export class UpsertPaymentComponent {
  @Input() isVisible = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  searchParams = {
    groupId: '',
    type: 1,
    date: new Date(),
    time: new Date(),
  };

  handleCancel() {
    this.isVisibleChange.next(false);
  }

  onSave() {
    console.log(this.searchParams);
  }
}
