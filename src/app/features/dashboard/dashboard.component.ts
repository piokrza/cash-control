import { ChangeDetectionStrategy, Component, DestroyRef, OnDestroy, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { filter, tap } from 'rxjs';

import { AuthApiService } from '#auth/services';
import { AuthActions } from '#auth/store';
import { CashFlowActions } from '#cash-flow/store';
import { ConfigActions } from '#core/config/store';
import { DbSubscriptionService } from '#core/services';
import { DriveActions } from '#drive/store';
import { TaskerActions } from '#tasker/store';

@Component({
  selector: 'org-dashboard',
  template: `
    <org-layout>
      <router-outlet />
    </org-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authApiService = inject(AuthApiService);
  private readonly dbSubscriptionService = inject(DbSubscriptionService);

  ngOnInit(): void {
    this.authApiService.authState$
      .pipe(
        filter(Boolean),
        tap(({ uid }) => {
          this.store.dispatch(AuthActions.loadUserData({ uid }));
          this.store.dispatch(ConfigActions.loadConfig({ uid }));
          this.store.dispatch(TaskerActions.loadTasks({ uid }));
          this.store.dispatch(TaskerActions.loadNotes({ uid }));
          this.store.dispatch(CashFlowActions.loadCashFlow({ uid }));
          this.store.dispatch(DriveActions.loadFiles({ uid }));
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.dbSubscriptionService.unsubscribe();
  }
}
