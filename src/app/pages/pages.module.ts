import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconsProviderModule } from './icons-provider.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';

import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { WelcomeComponent } from './welcome/welcome.component';
import { GroupComponent } from './group/group.component';

@NgModule({
  declarations: [PagesComponent, WelcomeComponent, GroupComponent],
  imports: [
    CommonModule,

    PagesRoutingModule,

    IconsProviderModule,
    NzAvatarModule,
    NzDropDownModule,
    NzLayoutModule,
    NzMenuModule,
    NzMessageModule,
    NzPageHeaderModule,
  ],
})
export class PagesModule {}
