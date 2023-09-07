import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthSharingService } from './auth-sharing.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoading = false;
  authSharingService_isLoading_subscription = new Subscription();

  constructor(private authSharingService: AuthSharingService) {}

  ngOnInit(): void {
    this.authSharingService_isLoading_subscription = this.authSharingService.isLoading.subscribe(v => this.isLoading = v);
  }

  ngOnDestroy(): void {
    this.authSharingService_isLoading_subscription.unsubscribe();
  }
}
