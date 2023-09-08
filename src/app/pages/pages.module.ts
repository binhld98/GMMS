import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconsProviderModule } from './icons-provider.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';

import { GroupComponent } from './group/group.component';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [PagesComponent, WelcomeComponent, GroupComponent],
  imports: [
    CommonModule,

    PagesRoutingModule,

    IconsProviderModule,
    NzAvatarModule,
    NzCardModule,
    NzDropDownModule,
    NzGridModule,
    NzLayoutModule,
    NzListModule,
    NzMenuModule,
    NzMessageModule,
    NzPageHeaderModule,
  ],
})
export class PagesModule {}
