import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/*
 * MODULES
 */
import { IconsProviderModule } from './icons-provider.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';

/*
 * COMPONENTS
 */
import { GroupComponent } from './group/group.component';
import { GroupDetailComponent } from './group/group-detail/group-detail.component';
import { GroupMasterComponent } from './group/group-master/group-master.component';
import { UpsertGroupComponent } from './group/upsert-group/upsert-group.component';
import { InviteMemberComponent } from './group/invite-member/invite-member.component';

import { WelcomeComponent } from './welcome/welcome.component';

/*
 * PIPES
 */
import {
  GroupStatusPipe,
  GroupRolePipe,
  SecondToMilisecond,
} from './common.pipe';

/*
 * NZ ZORO
 */
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

@NgModule({
  declarations: [
    PagesComponent,
    WelcomeComponent,
    GroupComponent,
    UpsertGroupComponent,
    GroupDetailComponent,
    GroupMasterComponent,
    InviteMemberComponent,

    GroupStatusPipe,
    GroupRolePipe,
    SecondToMilisecond,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    PagesRoutingModule,

    IconsProviderModule,
    NzAvatarModule,
    NzButtonModule,
    NzCardModule,
    NzDropDownModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NzLayoutModule,
    NzListModule,
    NzMenuModule,
    NzModalModule,
    NzMessageModule,
    NzPageHeaderModule,
    NzSelectModule,
    NzSpinModule,
    NzTableModule,
    NzTypographyModule,
    NzEmptyModule,
  ],
})
export class PagesModule {}
