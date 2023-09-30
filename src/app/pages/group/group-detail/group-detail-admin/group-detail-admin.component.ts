import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { GROUP_USER_STATUS } from 'src/app/@core/constants/common.constant';
import { GroupBusiness } from 'src/app/@core/businesses/group.business';
import { GroupDetailDto, GroupUserDto } from 'src/app/@core/dtos/group.dto';

@Component({
  selector: 'gmm-group-detail-admin',
  templateUrl: './group-detail-admin.component.html',
  styleUrls: ['./group-detail-admin.component.css'],
})
export class GroupDetailAdminComponent implements OnInit, OnDestroy, OnChanges {
  @Input() groupId: string | null = null;
  group: GroupDetailDto | null = null;
  isLoading = false;
  isVisibleInvite = false;
  memberIds: string[] | [] = [];

  constructor(
    private groupBuiness: GroupBusiness,
    private modalService: NzModalService,
    private messageService: NzMessageService
  ) {}

  isShowDeactivateMemberButton(gu: GroupUserDto): boolean {
    if (
      gu.joinedStatus == GROUP_USER_STATUS.JOINED &&
      this.group?.adminId != gu.userId
    ) {
      return true;
    }

    return false;
  }

  isShowActivateMemberButton(gu: GroupUserDto) {
    if (
      gu.joinedStatus == GROUP_USER_STATUS.DEACTIVATED &&
      this.group?.adminId != gu.userId
    ) {
      return true;
    }

    return false;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  ngOnChanges(changes: SimpleChanges) {
    const groupId: string | null = changes['groupId'].currentValue;
    if (groupId != null) {
      this.isLoading = true;
      this.groupBuiness.getGroupDetail(groupId).then((g) => {
        this.group = g;
        this.memberIds = !!this.group
          ? this.group.users.map((u) => u.userId)
          : [];
        this.isLoading = false;
      });
    }
  }

  onInviteMember() {
    this.isVisibleInvite = true;
  }

  onInvitedSuccess() {
    this.reloadPanel();
  }

  private reloadPanel() {
    const changes = {
      groupId: new SimpleChange(this.groupId, this.groupId, false),
    } as SimpleChanges;
    this.ngOnChanges(changes);
  }

  onDeactivatemMember(gu: GroupUserDto) {
    this.modalService.confirm({
      nzTitle: `Vô hiệu hóa thành viên <i>${gu.userName}</i>?`,
      nzContent:
        'Thành viên bị vô hiệu hóa sẽ không thể xuất hiện trong các phiếu chi mới tính từ thời điểm bị vô hiệu hóa. Tuy nhiên với các hóa đơn mà có phiếu chi phát sinh trước thời điểm bị vô hiệu hóa, thành viên này vẫn có nghĩa vụ phải thanh toán đầy đủ.',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Hủy',
      nzOnOk: () => {
        return this.groupBuiness
          .deactivateMember(this.group!.id, gu.userId)
          .then(() => {
            this.messageService.create('success', 'Vô hiệu hóa thành công');
            gu.joinedStatus = GROUP_USER_STATUS.DEACTIVATED; // no need this.reloadPanel();
          })
          .catch((error) => {
            this.messageService.create('error', 'Vô hiệu hóa thất bại');
          });
      },
    });
  }

  onActivatemMember(gu: GroupUserDto) {
    this.modalService.confirm({
      nzTitle: `Hủy vô hiệu hóa thành viên <i>${gu.userName}</i>?`,
      nzContent:
        'Thành viên có thể xuất hiện trong các phiếu chi mới kể từ khi được hủy vô hiệu hóa.',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Hủy',
      nzOnOk: () => {
        return this.groupBuiness
          .activateMember(this.group!.id, gu.userId)
          .then(() => {
            this.messageService.create('success', 'Hủy vô hiệu hóa thành công');
            gu.joinedStatus = GROUP_USER_STATUS.JOINED; // no need this.reloadPanel();
          })
          .catch((error) => {
            this.messageService.create('error', 'Hủy vô hiệu hóa thất bại');
          });
      },
    });
  }
}
