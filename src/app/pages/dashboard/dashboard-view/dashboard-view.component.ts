import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { DashboardFacade } from '#pages/dashboard';

@UntilDestroy()
@Component({
  selector: 'ctrl-dashboard-view',
  template: `
    <ctrl-layout>
      <router-outlet />
    </ctrl-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardViewComponent implements OnInit {
  private readonly dashboardFacade = inject(DashboardFacade);

  public ngOnInit(): void {
    this.dashboardFacade.onChainChange$().pipe(untilDestroyed(this)).subscribe();
    this.dashboardFacade.onAccountChanged$().pipe(untilDestroyed(this)).subscribe();
    this.dashboardFacade.checkWalletExtention$().pipe(untilDestroyed(this)).subscribe();
    this.dashboardFacade.requestChainIdAndAccounts$().pipe(untilDestroyed(this)).subscribe();
  }
}
