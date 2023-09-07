import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/@core/auth/auth.service';
import { AuthSharingService } from '../auth-sharing.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm!: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private authSharingService: AuthSharingService,
    private messageService: NzMessageService,
  ) { }

  submitForm(): void {
    if (this.validateForm.valid) {
      const formValue = this.validateForm.value;
      this.authSharingService.isLoading.next(true);
      this.authService
        .login(formValue.email, formValue.password)
        .catch(error => {
          this.messageService.create('error', error.message);
        })
        .finally(() => {
          this.authSharingService.isLoading.next(false);
        });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
    });
  }
}
