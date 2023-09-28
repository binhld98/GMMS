import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'gmm-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css'],
})
export class PdfViewerComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() title: string = '';
  @Input() dataObjUrl: string = '';
  @Input() isUnderModal = true;
  @Output() next = new EventEmitter<void>();

  onClose() {
    this.visibleChange.next(false);
  }
}
