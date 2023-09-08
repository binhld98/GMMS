import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AuthSharingService } from '../auth-sharing.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  validateForm!: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private auth: Auth,
    private authSharingService: AuthSharingService,
    private messageService: NzMessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  submitForm(): void {
    if (!this.validateForm.valid) {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    } else {
      const formValue = this.validateForm.value;
      this.authSharingService.isLoading.next(true);

      signInWithEmailAndPassword(this.auth, formValue.email, formValue.password)
        .then((userCredential) => {
          this.router.navigate(['/']);
        })
        .catch((error) => {
          const message = this.getSignInError(error.code);
          this.messageService.create('error', message);
        })
        .finally(() => {
          this.authSharingService.isLoading.next(false);
        });
    }
  }

  private getSignInError(errorCode: string) {
    let message = 'Có lỗi xảy ra, vui lòng thử lại sau';
    switch (errorCode) {
      case 'auth/user-not-found':
        message = 'Sai tài khoản';
        break;

      case 'auth/wrong-password':
        message = 'Sai mật khẩu';
        break;

      case 'auth/user-disabled':
        message = 'Tài khoản bị khóa';
        break;

      case 'auth/too-many-requests':
        message = 'Thao tác quá nhiều';
        break;

      default:
        break;
    }

    return message;
  }
}
