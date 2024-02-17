import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { PaymentPdfDto } from '../dtos/payment.dto';

export class PdfUtil {
  static A4_PAGE_W = 596;
  static A4_PAGE_H = 842;
  static A4_TOP_MRG = 36;
  static A4_BOT_MRG = 36;
  static A4_LEFT_MRG = 36;
  static A4_RIGHT_MRG = 36;

  static async initDoc(paperSize: string = 'a4') {
    // fetch required fonts
    const cacheName = 'times-cache-v1';
    const fontNames = ['times', 'timesi', 'timesbd', 'timesbi'];
    const fn = async (cache: Cache, url: string) => {
      let response = await cache.match(url);
      if (response) {
        return response;
      }

      response = await fetch(url);
      if (response.status == 200) {
        cache.put(url, response.clone());
      }

      return response;
    };

    const cache = await caches.open(cacheName);
    const responses = await Promise.all(
      fontNames.map((name) => {
        return fn(cache, '/assets/fonts/' + name + '.base64');
      })
    );

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: paperSize,
    });

    const fonts = await Promise.all(
      responses.map((res) => {
        return res.text();
      })
    );

    for (let i = 0; i < fonts.length; i++) {
      doc.addFileToVFS(fontNames[i] + '.tff', fonts[i]);
      doc.addFont(fontNames[i] + '.tff', 'gmm_' + fontNames[i], 'normal');
    }

    return doc;
  }

  /**
   * @returns Blob
   */
  static async makePaymentPdf(payment: PaymentPdfDto) {
    const doc = await PdfUtil.initDoc();

    // left header
    doc.setFont('gmm_times');
    doc.setFontSize(12);
    doc.text(payment.groupName, PdfUtil.A4_LEFT_MRG, PdfUtil.A4_TOP_MRG);

    // right header
    doc.text(
      'GMM System',
      PdfUtil.A4_PAGE_W - PdfUtil.A4_RIGHT_MRG,
      PdfUtil.A4_TOP_MRG,
      {
        align: 'right',
      }
    );

    // center
    doc.setFont('gmm_timesbd');
    doc.setFontSize(16);
    doc.text(
      'PHIẾU CHI',
      PdfUtil.A4_PAGE_W / 2 - doc.getTextWidth('PHIẾU CHI') / 2,
      PdfUtil.A4_TOP_MRG + 48,
      {
        align: 'left',
      }
    );

    const paymentAtString = PdfUtil.ToDateStr(payment.paymentAt);
    doc.setFont('gmm_timesi');
    doc.setFontSize(12);
    doc.text(
      paymentAtString,
      PdfUtil.A4_PAGE_W / 2 - doc.getTextWidth(paymentAtString) / 2,
      PdfUtil.A4_TOP_MRG + 64,
      {
        align: 'left',
      }
    );

    // a side
    doc.setFont('gmm_timesbd');
    doc.setFontSize(12);
    doc.text('Bên A:', PdfUtil.A4_LEFT_MRG, PdfUtil.A4_TOP_MRG + 96, {
      align: 'left',
    });
    doc.setFont('gmm_times');
    doc.text(
      'Danh sách chủ chi bao gồm:',
      PdfUtil.A4_LEFT_MRG + doc.getTextWidth('Bên A:') + 6,
      PdfUtil.A4_TOP_MRG + 96,
      {
        align: 'left',
      }
    );

    const asideRows = payment.aSide.map((a) => {
      return [a.userName, a.amount, a.description];
    });
    autoTable(doc, {
      head: [
        [
          {
            content: 'Tên',
            styles: { halign: 'left', font: 'gmm_timesbd' },
          },
          {
            content: 'Số tiền',
            styles: { halign: 'center', font: 'gmm_timesbd' },
          },
          {
            content: 'Lý do',
            styles: { halign: 'left', font: 'gmm_timesbd' },
          },
        ],
      ],
      body: asideRows,
      startY: 144,
      theme: 'grid',
      headStyles: { halign: 'center' },
      columnStyles: {
        0: { cellWidth: 125 },
        1: { halign: 'center', cellWidth: 75 },
      },
      styles: {
        font: 'gmm_times',
        lineWidth: 0.5,
        lineColor: '#00000',
        fillColor: '#ffffff',
        textColor: '#00000',
      },
    });

    // b side
    // @ts-ignore
    let finalY = doc.lastAutoTable.finalY;
    if (finalY + 32 > PdfUtil.A4_PAGE_H - PdfUtil.A4_BOT_MRG) {
      finalY = PdfUtil.A4_TOP_MRG - 32;
      doc.addPage();
    }

    doc.setFont('gmm_timesbd');
    doc.text('Bên B:', PdfUtil.A4_LEFT_MRG, finalY + 32);
    doc.setFont('gmm_times');
    doc.text(
      'Danh sách thụ hưởng bao gồm:',
      PdfUtil.A4_LEFT_MRG + doc.getTextWidth('Bên B:') + 6,
      finalY + 32
    );

    const bsideRows = payment.bSide.map((b) => {
      return ['- ' + b.userName];
    });
    autoTable(doc, {
      body: bsideRows,
      startY: finalY + 40,
      theme: 'grid',
      showHead: 'never',
      styles: {
        font: 'gmm_times',
        fontSize: 13,
        lineWidth: 0,
        lineColor: '#00000',
        fillColor: '#ffffff',
        textColor: '#00000',
      },
    });

    // signature
    // @ts-ignore
    finalY = doc.lastAutoTable.finalY;
    if (finalY + 64 > PdfUtil.A4_PAGE_H - PdfUtil.A4_BOT_MRG) {
      finalY = PdfUtil.A4_TOP_MRG - 32;
      doc.addPage();
    }

    const nowString = PdfUtil.ToDateStr(new Date());
    doc.setFont('gmm_timesi');
    doc.text(nowString, PdfUtil.A4_PAGE_W - PdfUtil.A4_RIGHT_MRG, finalY + 32, {
      align: 'right',
    });

    const centerY =
      PdfUtil.A4_PAGE_W -
      PdfUtil.A4_RIGHT_MRG -
      doc.getTextWidth(nowString) / 2;
    doc.setFont('gmm_timesbd');
    doc.text('Người lập phiếu', centerY, finalY + 48, {
      align: 'center',
    });

    doc.setFont('gmm_timesi');
    doc.text('(Ký, họ tên)', centerY, finalY + 64, {
      align: 'center',
    });

    // doc.setFont('gmm_times');
    // doc.text(payment.creatorName, centerY, finalY + 150, {
    //   align: 'center',
    // });

    return doc.output('blob');
  }

  /**
   * @returns e.g Ngày 02 tháng 09 năm 2023
   */
  static ToDateStr(date: Date) {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return 'Ngày ' + day + ' tháng ' + month + ' năm ' + year;
  }
}
