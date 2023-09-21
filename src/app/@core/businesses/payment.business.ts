import { Injectable } from '@angular/core';

import { jsPDF } from 'jspdf';

@Injectable({ providedIn: 'root' })
export class PaymentBusiness {
  public generatePayment(): string {
    const doc = new jsPDF();
    doc.text('Hello world!', 10, 10);
    return doc.output('datauristring');
  }
}
