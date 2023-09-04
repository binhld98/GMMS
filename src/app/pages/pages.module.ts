import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { WelcomeComponent } from './welcome/welcome.component';



@NgModule({
  declarations: [
    PagesComponent,
    WelcomeComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule
  ]
})
export class PagesModule { }
