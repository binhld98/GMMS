import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SafePipe, SecondToMilisecond } from './pipes/common.pipe';
import { GroupRolePipe, GroupStatusPipe } from './pipes/group.pipe';

import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';

import { GroupBusiness } from './businesses/group.business';
import { PaymentBusiness } from './businesses/payment.business';

import { UserRepository } from './repositories/user.repository';
import { GroupRepository } from './repositories/group.repository';
import { PaymentRepository } from './repositories/payment.repository';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';

@NgModule({
  declarations: [
    // PIPE
    SafePipe,
    SecondToMilisecond,
    GroupStatusPipe,
    GroupRolePipe,

    // COMPONENT
    PdfViewerComponent,
  ],
  imports: [CommonModule, NzDrawerModule, NzButtonModule],
  providers: [
    // BUSINESS
    GroupBusiness,
    PaymentBusiness,

    // REPOSITORY
    UserRepository,
    GroupRepository,
    PaymentRepository,
  ],
  bootstrap: [],
  exports: [
    // PIPE
    SafePipe,
    SecondToMilisecond,
    GroupStatusPipe,
    GroupRolePipe,

    // COMPONENT
    PdfViewerComponent,
  ],
})
export class CoreModule {}
