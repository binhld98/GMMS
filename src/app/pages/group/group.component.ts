import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

import { UserBusiness } from 'src/app/@core/businesses/user.business';
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

  constructor(
    private auth: Auth,
    private userBusiness: UserBusiness,
  ) {}

  ngOnInit(): void {
    const userId = this.auth.currentUser!.uid;
    this.grpSub = this.userBusiness
      .getJoinedGroupsByUserId(userId)
      .subscribe((grps) => {
        this.groups = grps;
        this.leftSpining = false;
      });
  }

  ngOnDestroy(): void {
    this.grpSub.unsubscribe();
  }

  onAddGroup() {
    this.isVisibleUpsert = true;
  }
}
