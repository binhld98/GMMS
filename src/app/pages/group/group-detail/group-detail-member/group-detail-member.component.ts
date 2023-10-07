import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { GROUP_USER_STATUS } from 'src/app/@core/constants/common.constant';
import { GroupBusiness } from 'src/app/@core/businesses/group.business';
import { GroupInUserDto, UserInGroupDto } from 'src/app/@core/dtos/group.dto';

@Component({
  selector: 'gmm-group-detail-member',
  templateUrl: './group-detail-member.component.html',
  styleUrls: ['./group-detail-member.component.css'],
})
export class GroupDetailMemberComponent implements OnChanges {
  @Input() cardMaxHeight = 0;
  @Input() group: GroupInUserDto | null = null;
  users: UserInGroupDto[] = [];
  isLoadingCard = false;
  isVisibleInvite = false;

  constructor(private groupBuiness: GroupBusiness) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes['group'] && !!changes['group'].currentValue) {
      this.isLoadingCard = true;
      const group = changes['group'].currentValue as GroupInUserDto;
      this.groupBuiness.getListUserInGroup(group.groupId).then((users) => {
        this.users = users.filter((u) => {
          return (
            u.groupUserStatus == GROUP_USER_STATUS.JOINED ||
            u.groupUserStatus == GROUP_USER_STATUS.ACTIVATED
          );
        });
        this.isLoadingCard = false;
      });
    }
  }
}
