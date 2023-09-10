import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
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
  grpDtlSub = new Subscription();
  isLoading = false;

  constructor(private groupBuiness: GroupBusiness) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.grpDtlSub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    const groupId: string | null = changes['groupId'].currentValue;
    if (groupId != null) {
      this.isLoading = true;
      this.grpDtlSub = this.groupBuiness
        .getGroupDetail(groupId)
        .subscribe((x) => {
          this.group = x;
          this.isLoading = false;
        });
    }
  }
}
