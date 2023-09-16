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
import { GroupMasterComponent } from './group/group-master/group-master.component';
import { UpsertGroupComponent } from './group/upsert-group/upsert-group.component';
import { GroupDetailAdminComponent } from './group/group-detail/group-detail-admin/group-detail-admin.component';
import { GroupDetailMemberComponent } from './group/group-detail/group-detail-member/group-detail-member.component';
import { InviteMemberComponent } from './group/invite-member/invite-member.component';

import { PaymentComponent } from './payment/payment.component';
import { UpsertPaymentComponent } from './payment/upsert-payment/upsert-payment.component';

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
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
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
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@NgModule({
  declarations: [
    PagesComponent,
    WelcomeComponent,

    GroupComponent,
    GroupMasterComponent,
    UpsertGroupComponent,
    GroupDetailAdminComponent,
    GroupDetailMemberComponent,
    InviteMemberComponent,

    GroupStatusPipe,
    GroupRolePipe,
    SecondToMilisecond,
    PaymentComponent,
    UpsertPaymentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    PagesRoutingModule,

    IconsProviderModule,
    NzAvatarModule,
    NzBadgeModule,
    NzButtonModule,
    NzCardModule,
    NzDatePickerModule,
    NzDrawerModule,
    NzDropDownModule,
    NzEmptyModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NzLayoutModule,
    NzListModule,
    NzMenuModule,
    NzMessageModule,
    NzModalModule,
    NzPageHeaderModule,
    NzSelectModule,
    NzSpaceModule,
    NzSpinModule,
    NzTableModule,
    NzTagModule,
    NzTimePickerModule,
    NzTypographyModule,
  ],
})
export class PagesModule {}
