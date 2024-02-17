import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { GROUP_USER_STATUS } from 'src/app/@core/constants/common.constant';
import { GroupBusiness } from 'src/app/@core/businesses/group.business';
import { GroupInUserDto, UserInGroupDto } from 'src/app/@core/dtos/group.dto';
import { ColumnFilterSorterConfig } from 'src/app/@core/dtos/common.dto';

@Component({
  selector: 'gmm-group-detail-admin',
  templateUrl: './group-detail-admin.component.html',
  styleUrls: ['./group-detail-admin.component.css'],
})
export class GroupDetailAdminComponent implements OnChanges {
  @Input() cardMaxHeight = 0;
  tableScroll: { x?: string; y?: string } = {};
  @Input() group: GroupInUserDto | null = null;
  users: UserInGroupDto[] = [];
  isLoadingCard = false;
  isVisibleInvite = false;
  userIds: string[] = [];

  // table
  columnsConfig: ColumnFilterSorterConfig<UserInGroupDto> = {
    userName: {
      showFilter: false,
      filterMultiple: false,
      filterOptions: [],
      filterFunction: null,
      showSort: true,
      sortPriority: false,
      sortOrder: null,
      sortFunction: (a, b) => {
        return a.userName.localeCompare(b.userName);
      },
      sortDirections: [],
    },
    groupUserStatus: {
      showFilter: false,
      filterMultiple: false,
      filterOptions: [],
      filterFunction: null,
      showSort: false,
      sortPriority: false,
      sortOrder: null,
      sortFunction: null,
      sortDirections: [],
    },
    lastJoinedAt: {
      showFilter: false,
      filterMultiple: false,
      filterOptions: [],
      filterFunction: null,
      showSort: true,
      sortPriority: false,
      sortOrder: null,
      sortFunction: (a, b) => {
        const aTime = !!a.joinedAt
          ? a.joinedAt.getTime()
          : a.activatedAt
          ? a.activatedAt.getTime()
          : 0;

        const bTime = !!b.joinedAt
          ? b.joinedAt.getTime()
          : b.activatedAt
          ? b.activatedAt.getTime()
          : 0;

        return aTime - bTime;
      },
      sortDirections: [],
    },
    role: {
      showFilter: false,
      filterMultiple: false,
      filterOptions: [],
      filterFunction: null,
      showSort: false,
      sortPriority: false,
      sortOrder: null,
      sortFunction: null,
      sortDirections: [],
    },
  };

  private resetColumnConfig() {
    for (let key in this.columnsConfig) {
      this.columnsConfig[key].sortOrder = null;
    }
  }

  constructor(
    private groupBusiness: GroupBusiness,
    private modalService: NzModalService,
    private messageService: NzMessageService
  ) {}

  isShowDeactivateMemberButton(user: UserInGroupDto): boolean {
    return (
      user.userId != this.group!.adminId &&
      (user.groupUserStatus == GROUP_USER_STATUS.JOINED ||
        user.groupUserStatus == GROUP_USER_STATUS.ACTIVATED)
    );
  }

  isShowActivateMemberButton(user: UserInGroupDto) {
    return (
      user.userId != this.group!.adminId &&
      user.groupUserStatus == GROUP_USER_STATUS.DEACTIVATED
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes['group'] && !!changes['group'].currentValue) {
      this.isLoadingCard = true;
      const group = changes['group'].currentValue as GroupInUserDto;
      this.groupBusiness.getListUserInGroup(group.groupId).then((users) => {
        this.users = users;
        this.userIds = this.users.map((u) => u.userId);
        this.isLoadingCard = false;
      });
      this.resetColumnConfig();
    }

    if (!!changes['cardMaxHeight'] && !!changes['cardMaxHeight'].currentValue) {
      const cardMaxHeight = changes['cardMaxHeight'].currentValue;
      this.tableScroll = { y: cardMaxHeight - 137 + 'px' };
    }
  }

  onInviteMember() {
    this.isVisibleInvite = true;
  }

  onInvitedSuccess(users: UserInGroupDto[]) {
    users.forEach((u) => {
      this.users.push(u);
    });
    this.users.sort((a, b) => a.userName.localeCompare(b.userName));

    this.users = JSON.parse(JSON.stringify(this.users));
  }

  onDeactivatemMember(user: UserInGroupDto) {
    this.modalService.confirm({
      nzTitle: `Vô hiệu hóa thành viên <i>${user.userName}</i>?`,
      nzContent:
        'Thành viên bị vô hiệu hóa sẽ không thể xuất hiện trong các phiếu chi mới tính từ thời điểm bị vô hiệu hóa. Tuy nhiên với các hóa đơn mà có phiếu chi phát sinh trước thời điểm bị vô hiệu hóa, thành viên này vẫn có nghĩa vụ phải thanh toán đầy đủ.',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Hủy',
      nzOnOk: () => {
        return this.groupBusiness
          .deactivateMember(this.group!.groupId, user.userId)
          .then(() => {
            this.messageService.create('success', 'Vô hiệu hóa thành công');
            user.groupUserStatus = GROUP_USER_STATUS.DEACTIVATED;
            user.deactivatedAt = new Date();
          })
          .catch((error) => {
            this.messageService.create('error', 'Vô hiệu hóa thất bại');
          });
      },
    });
  }

  onActivatemMember(user: UserInGroupDto) {
    this.modalService.confirm({
      nzTitle: `Hủy vô hiệu hóa thành viên <i>${user.userName}</i>?`,
      nzContent:
        'Thành viên có thể xuất hiện trong các phiếu chi mới kể từ khi được hủy vô hiệu hóa.',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Hủy',
      nzOnOk: () => {
        return this.groupBusiness
          .activateMember(this.group!.groupId, user.userId)
          .then(() => {
            this.messageService.create('success', 'Hủy vô hiệu hóa thành công');
            user.groupUserStatus = GROUP_USER_STATUS.JOINED;
            user.activatedAt = new Date();
          })
          .catch((error) => {
            this.messageService.create('error', 'Hủy vô hiệu hóa thất bại');
          });
      },
    });
  }
}
