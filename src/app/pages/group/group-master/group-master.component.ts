import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';

import { GROUP_USER_STATUS } from 'src/app/@core/constants/common.constant';
import { GroupBusiness } from 'src/app/@core/businesses/group.business';
import { GroupMasterDto } from 'src/app/@core/dtos/group.dto';

@Component({
  selector: 'gmm-group-master',
  templateUrl: './group-master.component.html',
  styleUrls: ['./group-master.component.css'],
})
export class GroupMasterComponent implements OnInit {
  groups: GroupMasterDto[] = [];
  isLoading = true;
  isVisibleUpsert = false;
  @Output() targetGroupChange = new EventEmitter<GroupMasterDto>();
  activeIndex: number = -1;

  constructor(private auth: Auth, private groupBusiness: GroupBusiness) {}

  ngOnInit(): void {
    this.onGroupSaved();
  }

  onAddGroup() {
    this.isVisibleUpsert = true;
  }

  onGroupSaved() {
    this.isLoading = true;
    this.groupBusiness
      .getGroupsOfUserBy(this.auth.currentUser!.uid, [GROUP_USER_STATUS.JOINED])
      .then((groups) => {
        this.groups = groups;
        this.isLoading = false;
      });
  }

  onClickGroup(group: GroupMasterDto) {
    this.targetGroupChange.emit(group);
    this.activeIndex = this.groups.indexOf(group);
  }
}
