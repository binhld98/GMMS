import { Pipe, PipeTransform } from '@angular/core';
import { GROUP_USER_ROLE, GROUP_USER_STATUS } from '../@core/models/group-user';

@Pipe({ name: 'gmm_group_status' })
export class GroupStatusPipe implements PipeTransform {
  transform(value: number): string {
    let text = '';
    switch (value) {
      case GROUP_USER_STATUS.JOINED:
        text = 'Đã tham gia';
        break;

      case GROUP_USER_STATUS.WAIT_CONFIRM:
        text = 'Chờ xác nhận';
        break;

      case GROUP_USER_STATUS.DEACTIVATED:
        text = 'Vô hiệu hóa';
        break;

      default:
        break;
    }

    return text;
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

@Pipe({ name: 'gmm_s_to_ms' })
export class SecondToMilisecond implements PipeTransform {
  transform(value: number | null | undefined): number | null {
    if (!value) {
      return null;
    }

    return value * 1000;
  }
}
