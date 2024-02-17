import { Component, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  resizeObservable$: Observable<Event> = new Observable<Event>();
  resizeSubscription$: Subscription = new Subscription();

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.appService.w$.next(window.innerWidth);
    this.appService.h$.next(window.innerHeight);
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((e) => {
      if (e.target instanceof Window) {
        this.appService.w$.next(e.target.innerWidth);
        this.appService.h$.next(e.target.innerHeight);
      }
    });
  }

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe();
  }
}
