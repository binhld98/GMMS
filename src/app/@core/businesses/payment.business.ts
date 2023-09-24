import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

import * as pdf from '../constants/pdf.constant';
import { times } from '../constants/times_font.constant';
import { timesi } from '../constants/timesi_font.constant';
import { timesbd } from '../constants/timesbd_font.constant';
import { timesbi } from '../constants/timesbi_font.constant';

@Injectable()
export class PaymentBusiness {
  public generatePayment(): string {
    // init setup
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4',
    });
    doc.addFileToVFS('times.ttf', times);
    doc.addFileToVFS('timesi.ttf', timesi);
    doc.addFileToVFS('timesbd.ttf', timesbd);
    doc.addFileToVFS('timesbi.ttf', timesbi);
    doc.addFont('times.ttf', 'gmm_times', 'normal');
    doc.addFont('timesi.ttf', 'gmm_timesi', 'normal');
    doc.addFont('timesbd.ttf', 'gmm_timesbd', 'normal');
    doc.addFont('timesbi.ttf', 'gmm_timesbi', 'normal');

    // left header
    doc.setFont('gmm_times');
    doc.setFontSize(12);
    const leftHeaderText = 'Nhóm: Nhóm 1';
    doc.text(leftHeaderText, pdf.LEFT_MARGIN, pdf.TOP_MARGIN);

    // right header
    const rightHeaderText = 'GMM System';
    doc.text(
      rightHeaderText,
      pdf.PAGE_WIDTH - pdf.RIGHT_MARGIN,
      pdf.TOP_MARGIN,
      {
        align: 'right',
      }
    );

    // center
    doc.setFont('gmm_timesbd');
    doc.setFontSize(16);
    doc.text(
      'PHIẾU CHI',
      pdf.PAGE_WIDTH / 2 - doc.getTextWidth('PHIẾU CHI') / 2,
      pdf.TOP_MARGIN + 32,
      {
        align: 'left',
      }
    );

    const day = 'Ngày 23 Tháng 11 Năm 1998';
    doc.setFont('gmm_timesi');
    doc.setFontSize(12);
    doc.text(
      day,
      pdf.PAGE_WIDTH / 2 - doc.getTextWidth(day) / 2,
      pdf.TOP_MARGIN + 48,
      {
        align: 'left',
      }
    );

    return doc.output('datauristring');
  }
}
