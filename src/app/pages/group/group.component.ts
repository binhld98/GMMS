import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { GroupBusiness } from 'src/app/@core/businesses/group.business';
import { GroupInUserDto } from 'src/app/@core/dtos/group.dto';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'gmm-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
})
export class GroupComponent implements OnInit {
  app_h$_sub = new Subscription();
  cardMaxHeight = 0;
  groups: GroupInUserDto[] = [];
  group: GroupInUserDto | null = null;
  currentUserId = '';
  isLoadingCard = false;

  constructor(
    private auth: Auth,
    private appService: AppService,
    private groupBusiness: GroupBusiness
  ) {}

  ngOnInit(): void {
    // window resize
    this.app_h$_sub = this.appService.h$.subscribe((h) => {
      this.cardMaxHeight = h - 186;
    });

    this.currentUserId = this.auth.currentUser!.uid;
    this.isLoadingCard = true;
    this.groupBusiness.getListGroupInUser(this.currentUserId).then((g) => {
      this.groups = g;
      this.isLoadingCard = false;
    });
  }

  ngOnDestroy(): void {
    this.app_h$_sub.unsubscribe();
  }

  viewGroupDetail(group: GroupInUserDto) {
    this.group = group;
  }
}
