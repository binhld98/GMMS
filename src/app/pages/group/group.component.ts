import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';


@Component({
  selector: 'gmm-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
})
export class GroupComponent implements OnInit, OnDestroy {
  groupDetailId: string | null = null;

  constructor(private auth: Auth) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  viewGroupDetail(groupId: any) {
    this.groupDetailId = groupId;
  }
}
