import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { GroupDetailDto } from 'src/app/@core/dtos/group.dto';

@Component({
  selector: 'gmm-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css'],
})
export class GroupDetailComponent implements OnInit, OnDestroy, OnChanges {
  @Input() groupId: string | null = null;
  group: GroupDetailDto | null = null;

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  ngOnChanges(changes: SimpleChanges) {
    const groupId: string | null = changes['groupId'].currentValue;
    if (groupId != null) {
    }
  }
}
