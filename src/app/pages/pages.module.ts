import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IconsProviderModule } from './icons-provider.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';

import { GroupComponent } from './group/group.component';
import { UpsertGroupComponent } from './group/modal/upsert-group/upsert-group.component';

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
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [
    PagesComponent,
    WelcomeComponent,
    GroupComponent,
    UpsertGroupComponent,
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
    NzSpinModule,
  ],
})
export class PagesModule {}
