import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { GroupMasterDto } from 'src/app/@core/dtos/group.dto';

@Component({
  selector: 'gmm-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
})
export class GroupComponent implements OnInit, OnDestroy {
  groupDetailId: string | null = null;
  groupDetailAdminId: string | null = null;
  readonly currentUserId: string | null = null;

  constructor(private auth: Auth) {
    this.currentUserId = auth.currentUser!.uid;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  viewGroupDetail(group: GroupMasterDto) {
    this.groupDetailId = group.id;
    this.groupDetailAdminId = group.adminId;
  }
}
