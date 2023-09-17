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

  get aSideFA() {
    return <FormArray>this.form.get('aSide');
  }

  onAddToASide() {
    this.aSideFA.push(
      this.fb.group({
        userId: [null, [Validators.required]],
        amount: [null, [Validators.required]],
        description: [null, [Validators.required]],
      })
    );
  }

  removeFromASide(index: number) {
    this.aSideFA.removeAt(index);
  }

  get bSideFA() {
    return <FormArray>this.form.get('bSide');
  }

  onAddToBSide() {
    this.bSideFA.push(
      this.fb.group({
        userId: [null, [Validators.required]],
      })
    );
  }

  removeFromBSide(index: number) {
    this.bSideFA.removeAt(index);
  }

  ngOnDestroy(): void {}

  handleCancel() {
    this.isVisibleChange.next(false);
  }

  onSave() {
    console.log(this.form);
  }
}
