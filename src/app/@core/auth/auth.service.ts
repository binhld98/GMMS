import { Injectable } from '@angular/core';

import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth) {}

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        const user = userCredential.user;
      })
      .catch((error) => this.throwSignInError(error.code));
  }

  private throwSignInError(errorCode: string) {
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

    throw new Error(message);
  }

  logout() {
    return signOut(this.auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        throw new Error('Có lỗi xảy ra, vui lòng thử lại sau');
      });
  }
}
