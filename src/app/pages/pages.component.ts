import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';

import { CommonUtil } from '../@core/utils/common.util';

import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-page',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css'],
})
export class PagesComponent implements OnInit {
  isCollapsed = false;
  userName: string | null | undefined = '';

  constructor(
    private messageService: NzMessageService,
    private router: Router,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    const email = this.auth.currentUser?.email ?? '';
    if (email.length > 7) {
      this.userName = email.substring(0, 7) + '...';
    } else {
      this.userName = email;
    }
  }

  onLogout() {
    signOut(this.auth)
      .then(() => {
        this.router.navigate(['/auth/login']);
      })
      .catch((error) => {
        this.messageService.create('error', CommonUtil.COMMON_ERROR_MESSAGE);
      });
  }
}
