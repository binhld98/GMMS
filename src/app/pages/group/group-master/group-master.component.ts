import {
  Component,
  EventEmitter,
  Output,
  Input,
  SimpleChanges,
} from '@angular/core';
import { GroupInUserDto } from 'src/app/@core/dtos/group.dto';

@Component({
  selector: 'gmm-group-master',
  templateUrl: './group-master.component.html',
  styleUrls: ['./group-master.component.css'],
})
export class GroupMasterComponent {
  @Input() cardMaxHeight = 0;
  listMaxHeight = 0;
  @Input() groups: GroupInUserDto[] = [];
  isVisibleUpsert = false;
  @Output() targetGroupChange = new EventEmitter<GroupInUserDto>();
  activeIndex: number = -1;

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes['cardMaxHeight'] && !!changes['cardMaxHeight'].currentValue) {
      this.listMaxHeight = this.cardMaxHeight - 98;
    }
  }

  onAddGroup() {
    this.isVisibleUpsert = true;
  }

  onGroupSaved(group: GroupInUserDto) {
    const _groups = JSON.parse(JSON.stringify(this.groups)) as GroupInUserDto[];
    _groups.push(group);
    _groups.sort((a, b) => {
      return a.groupName.localeCompare(b.groupName);
    });
    this.groups = _groups;
  }

  onClickGroup(group: GroupInUserDto) {
    this.targetGroupChange.emit(group);
    this.activeIndex = this.groups.indexOf(group);
  }
}
