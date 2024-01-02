import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PrimeIcons } from 'primeng/api';
import { Observable } from 'rxjs';

import { CashFlow, CashFlowData } from '#cash-flow/models';
import { CashFlowFacadeService } from '#cash-flow/services';

@UntilDestroy()
@Component({
  selector: 'org-cash-flow',
  templateUrl: './cash-flow.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashFlowComponent {
  readonly #cashFlowFacadeService: CashFlowFacadeService = inject(CashFlowFacadeService);

  readonly isLoading$: Observable<boolean> = this.#cashFlowFacadeService.isLoading$;
  readonly incomesDataset$: Observable<CashFlowData> = this.#cashFlowFacadeService.incomesDataset$;
  readonly expensesDataset$: Observable<CashFlowData> = this.#cashFlowFacadeService.expensesDataset$;

  readonly activeTabIndex$: Observable<number> = this.#cashFlowFacadeService.activeTabIndex$;

  readonly PrimeIcons: typeof PrimeIcons = PrimeIcons;

  public addCashFlow(isIncomeMode: boolean): void {
    this.#cashFlowFacadeService.openCashFlowDialog$(isIncomeMode).pipe(untilDestroyed(this)).subscribe();
  }

  public updateIncome(updatedIncome: CashFlow): void {
    this.#cashFlowFacadeService.updateIncome$(updatedIncome).pipe(untilDestroyed(this)).subscribe();
  }

  public removeIncome(incomeId: string): void {
    this.#cashFlowFacadeService.removeIncome(incomeId);
  }

  public updateExpense(updatedExpense: CashFlow): void {
    this.#cashFlowFacadeService.updateExpense$(updatedExpense).pipe(untilDestroyed(this)).subscribe();
  }

  public removeExpense(expenseId: string): void {
    this.#cashFlowFacadeService.removeExpense(expenseId);
  }
}
