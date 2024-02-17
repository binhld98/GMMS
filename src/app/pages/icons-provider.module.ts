import { NgModule } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

import {
  EditOutline,
  EyeOutline,
  FormOutline,
  HomeOutline,
  LockOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  MinusOutline,
  PlusOutline,
  RetweetOutline,
  UnlockOutline,
  UsergroupAddOutline,
  UserOutline,
} from '@ant-design/icons-angular/icons';

const icons = [
  EditOutline,
  EyeOutline,
  FormOutline,
  HomeOutline,
  LockOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  MinusOutline,
  PlusOutline,
  RetweetOutline,
  UnlockOutline,
  UsergroupAddOutline,
  UserOutline,
];

@NgModule({
  imports: [NzIconModule.forChild(icons)],
  exports: [NzIconModule],
  providers: [],
})
export class IconsProviderModule {}
