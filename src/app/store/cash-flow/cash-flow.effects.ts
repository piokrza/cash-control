import { inject, Injectable } from '@angular/core';
import { CashFlowService } from '@app/common/services/cash-flow.service';
import { ToastStatus } from '@common/enums/toast-status.enum';
import { CashFlow } from '@common/models/cash-flow.model';
import { ToastService } from '@common/services/toast.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CashFlowActions } from '@store/cash-flow';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';

@Injectable()
export class IncomesEffects {
  private actions$: Actions = inject(Actions);
  private cashFlowService: CashFlowService = inject(CashFlowService);
  private toastService: ToastService = inject(ToastService);

  public getIncomes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CashFlowActions.getIncomes),
      exhaustMap(() => {
        return this.cashFlowService.getIncomes$().pipe(
          map((incomes: CashFlow[]) => {
            return CashFlowActions.getIncomesSuccess({ incomes });
          }),
          catchError((e) => {
            console.error(e);
            this.toastService.showMessage(
              ToastStatus.WARN,
              'Error!',
              'Something went wrong during fetching incomes from database'
            );
            return of(CashFlowActions.getIncomesFailure());
          })
        );
      })
    );
  });

  public addIncome$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CashFlowActions.addIncome),
        tap((income) => {
          console.log('to jest add income');
        })
      );
    },
    { dispatch: false }
  );

  public getExpenses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CashFlowActions.getIncomes),
      exhaustMap(() => {
        return this.cashFlowService.getExpenses$().pipe(
          map((expenses: CashFlow[]) => {
            return CashFlowActions.getExpensesSuccess({ expenses });
          }),
          catchError((e) => {
            console.error(e);
            this.toastService.showMessage(
              ToastStatus.WARN,
              'Error!',
              'Something went wrong during fetching expensess from database'
            );
            return of(CashFlowActions.getIncomesFailure());
          })
        );
      })
    );
  });
}
