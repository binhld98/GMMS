import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { GroupBusiness } from 'src/app/@core/businesses/group.business';
import { GroupDetailDto, GroupUserDto } from 'src/app/@core/dtos/group.dto';

@Component({
  selector: 'gmm-group-detail-member',
  templateUrl: './group-detail-member.component.html',
  styleUrls: ['./group-detail-member.component.css'],
})
export class GroupDetailMemberComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() groupId: string | null = null;
  group: GroupDetailDto | null = null;
  isLoading = false;
  isVisibleInvite = false;
  memberIds: string[] | [] = [];

  constructor(private groupBuiness: GroupBusiness) {}

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
}