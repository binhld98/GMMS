import { Pipe, PipeTransform } from '@angular/core';
import { GROUP_USER_ROLE, GROUP_USER_STATUS } from '../models/group-user';

@Pipe({ name: 'gmm_group_status' })
export class GroupStatusPipe implements PipeTransform {
  transform(value: number): { text: string; color: string } {
    let result = {
      text: '',
      color: '',
    };
    switch (value) {
      case GROUP_USER_STATUS.JOINED:
        result.text = 'Đã tham gia';
        result.color = 'success';
        break;

      case GROUP_USER_STATUS.WAIT_CONFIRM:
        result.text = 'Chờ xác nhận';
        result.color = 'warning';
        break;

      case GROUP_USER_STATUS.DEACTIVATED:
        result.text = 'Đã vô hiệu hóa';
        result.color = 'error';
        break;

      default:
        break;
    }

    return result;
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
