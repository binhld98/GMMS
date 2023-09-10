import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

import { GroupBusiness } from 'src/app/@core/businesses/group.business';
import { GroupDto } from 'src/app/@core/dtos/group.dto';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
})
export class GroupComponent implements OnInit, OnDestroy {
  grpSub = new Subscription();
  groups: GroupDto[] = [];

  leftSpining = true;

  isVisibleUpsert = false;

  constructor(private auth: Auth, private groupBusiness: GroupBusiness) {}

  ngOnInit(): void {
    this.onGroupSaved();
  }

  ngOnDestroy(): void {
    this.grpSub.unsubscribe();
  }

  onAddGroup() {
    this.isVisibleUpsert = true;
  }

  onGroupSaved() {
    this.grpSub.unsubscribe();
    this.leftSpining = true;
    this.grpSub = this.groupBusiness
      .getJoinedGroupsByUserId(this.auth.currentUser!.uid)
      .subscribe((grps) => {
        this.groups = grps;
        this.leftSpining = false;
      });
  }
}
