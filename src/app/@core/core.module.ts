import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SafePipe } from './pipes/common.pipe';

import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';

@NgModule({
  declarations: [SafePipe, PdfViewerComponent],
  imports: [CommonModule, NzDrawerModule, NzButtonModule],
  providers: [],
  bootstrap: [],
  exports: [SafePipe, PdfViewerComponent],
})
export class CoreModule {}
