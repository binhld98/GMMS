import { Component } from '@angular/core';

@Component({
  selector: 'gmm-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent {
  isVisibleUpsert = false;

  onAddPayment() {
    this.isVisibleUpsert = true;
  }
}
