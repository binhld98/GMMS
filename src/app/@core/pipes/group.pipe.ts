import { Pipe, PipeTransform } from '@angular/core';
import {
  GROUP_USER_ROLE,
  GROUP_USER_STATUS,
  TAG_COLOR,
} from '../constants/common.constant';
import { Tag } from '../dtos/common.dto';

@Pipe({ name: 'gmm_group_status' })
export class GroupStatusPipe implements PipeTransform {
  transform(value: number) {
    let tag = {
      text: 'unknown',
      color: TAG_COLOR.DEFAULT,
    } as Tag;

    switch (value) {
      case GROUP_USER_STATUS.INVITED:
        tag.text = 'Đã mời';
        tag.color = TAG_COLOR.YELLOW;
        break;

      case GROUP_USER_STATUS.JOINED:
        tag.text = 'Đã tham gia';
        tag.color = TAG_COLOR.GREEN;
        break;

      case GROUP_USER_STATUS.DEACTIVATED:
        tag.text = 'Đã vô hiệu hóa';
        tag.color = TAG_COLOR.RED;
        break;

      case GROUP_USER_STATUS.ACTIVATED:
        tag.text = 'Đã tham gia';
        tag.color = TAG_COLOR.GREEN;
        break;

      default:
        break;
    }

    return tag;
  }
}

@Pipe({ name: 'gmm_group_role' })
export class GroupRolePipe implements PipeTransform {
  transform(value: number): string {
    let text = '';
    switch (value) {
      case GROUP_USER_ROLE.ADMIN:
        text = 'Quản trị viên';
        break;

      case GROUP_USER_ROLE.MEMBER:
        text = 'Thành viên';
        break;

      default:
        break;
    }

    return text;
  }
}
