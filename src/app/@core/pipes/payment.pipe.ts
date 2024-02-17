import { Pipe, PipeTransform } from '@angular/core';
import { PAYMENT_STATUS, TAG_COLOR } from '../constants/common.constant';
import { Tag } from '../dtos/common.dto';

@Pipe({ name: 'gmm_payment_status' })
export class PaymentStatusPipe implements PipeTransform {
  transform(value: number) {
    let tag = {
      text: 'unknown',
      color: TAG_COLOR.DEFAULT,
    } as Tag;
    switch (value) {
      case PAYMENT_STATUS.DRAFT:
        tag.text = 'Lưu nháp';
        tag.color = TAG_COLOR.DEFAULT;
        break;

      case PAYMENT_STATUS.WAIT_APPROVE:
        tag.text = 'Chờ phê duyệt';
        tag.color = TAG_COLOR.YELLOW;
        break;

      case PAYMENT_STATUS.REJECTED:
        tag.text = 'Trả lại';
        tag.color = TAG_COLOR.RED;
        break;

      case PAYMENT_STATUS.APPROVED:
        tag.text = 'Đã duyệt';
        tag.color = TAG_COLOR.GREEN;
        break;

      case PAYMENT_STATUS.SETTLED:
        tag.text = 'Đã quyết toán';
        tag.color = TAG_COLOR.BLUE;
        break;

      case PAYMENT_STATUS.DUPPLICATE_SETTLED:
        tag.text = 'Lặp quyết toán';
        tag.color = TAG_COLOR.PURPLE;
        break;

      default:
        break;
    }

    return tag;
  }
}
