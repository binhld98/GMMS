import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'gmm-upsert-payment-modal',
  templateUrl: './upsert-payment.component.html',
  styleUrls: ['./upsert-payment.component.css'],
})
export class UpsertPaymentComponent implements OnInit, OnDestroy {
  @Input() isVisible = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      groupId: [null, [Validators.required]],
      type: [2, [Validators.required]],
      date: [new Date(), [Validators.required]],
      time: [new Date(), [Validators.required]],
      aSide: this.fb.array([]),
      bSide: this.fb.array([]),
    });
  }

  get aSideControl() {
    return (<FormArray>this.form.get('aSide')).controls;
  }

  onAddToASide() {
    this.aSideControl.push(
      this.fb.group({
        userId: [null, [Validators.required]],
        amount: [null, [Validators.required]],
        description: [null, [Validators.required]],
      })
    );
  }

  removeFromASide() {}

  get bSideControl() {
    return (<FormArray>this.form.get('bSide')).controls;
  }

  onAddToBSide() {
    this.bSideControl.push(
      this.fb.group({
        userId: [null, [Validators.required]],
      })
    );
  }

  removeFromBSide() {}

  ngOnDestroy(): void {}

  handleCancel() {
    this.isVisibleChange.next(false);
  }

  onSave() {
    console.log(this.form.value);
  }
}
