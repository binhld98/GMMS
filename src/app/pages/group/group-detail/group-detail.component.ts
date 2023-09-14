import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { GroupBusiness } from 'src/app/@core/businesses/group.business';
import { GroupDetailDto } from 'src/app/@core/dtos/group.dto';

@Component({
  selector: 'gmm-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css'],
})
export class GroupDetailComponent implements OnInit, OnDestroy, OnChanges {
  @Input() groupId: string | null = null;
  group: GroupDetailDto | null = null;
  isLoading = false;
  isVisibleInvite = false;

  constructor(private groupBuiness: GroupBusiness) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  ngOnChanges(changes: SimpleChanges) {
    const groupId: string | null = changes['groupId'].currentValue;
    if (groupId != null) {
      this.isLoading = true;
      this.groupBuiness.getGroupDetail(groupId).then((x) => {
        this.group = x;
        this.isLoading = false;
      });
    }
  }

  onInviteMember() {
    this.isVisibleInvite = true;
  }
}
