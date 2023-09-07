import { Component } from '@angular/core';
import { AuthService } from '../@core/auth/auth.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-page',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css'],
})
export class PagesComponent {
  isCollapsed = false;

  constructor(
    private authService: AuthService,
    private messageService: NzMessageService,
    private router: Router
  ) {}

  onLogout() {
    this.authService
      .logout()
      .then(() => this.router.navigate(['/auth/login']))
      .catch((error) => {
        this.messageService.create('error', error.message);
      });
  }
}
