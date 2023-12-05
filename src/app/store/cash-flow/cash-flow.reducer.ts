import { createReducer, on } from '@ngrx/store';

import { CashFlow } from '#cash-flow/models';
import { AuthActions } from '#store/auth';
import { CashFlowActions } from '#store/cash-flow';

export const FeatureKey = 'cashflow';

export interface State {
  incomes: CashFlow[];
  expenses: CashFlow[];
  isLoading: boolean;
}

const initialState: State = {
  incomes: [],
  expenses: [],
  isLoading: false,
};

export const Reducer = createReducer(
  initialState,

  on(CashFlowActions.getExpenses, (state): State => {
    return { ...state, isLoading: true };
  }),
  on(CashFlowActions.getExpensesSuccess, (state, { expenses }): State => {
    return { ...state, expenses, isLoading: false };
  }),
  on(CashFlowActions.getExpensesFailure, (state): State => {
    return { ...state, isLoading: false };
  }),

  on(CashFlowActions.getIncomes, (state): State => {
    return { ...state, isLoading: true };
  }),
  on(CashFlowActions.getIncomesSuccess, (state, { incomes }): State => {
    return { ...state, incomes, isLoading: false };
  }),
  on(CashFlowActions.getIncomesFailure, (state): State => {
    return { ...state, isLoading: false };
  }),

  on(CashFlowActions.addIncome, (state, { income }): State => {
    return { ...state, incomes: [...state.incomes, income] };
  }),
  on(CashFlowActions.addIncomeSuccess, (state): State => {
    return { ...state };
  }),
  on(CashFlowActions.addIncomeFailure, (state): State => {
    return { ...state };
  }),

  on(CashFlowActions.updateIncome, (state, { updatedIncome }): State => {
    const incomes: CashFlow[] = state.incomes.map((income: CashFlow) => {
      return income.id === updatedIncome.id ? updatedIncome : income;
    });

    return { ...state, incomes };
  }),
  on(CashFlowActions.updateIncomeSuccess, (state): State => {
    return { ...state };
  }),
  on(CashFlowActions.updateIncomeFailure, (state): State => {
    return { ...state };
  }),

  on(CashFlowActions.removeIncome, (state, { incomeId }): State => {
    const filteredIncomes: CashFlow[] = state.incomes.filter((income: CashFlow): boolean => income.id !== incomeId);
    return { ...state, incomes: filteredIncomes };
  }),

  on(CashFlowActions.addExpense, (state, { expense }): State => {
    return { ...state, expenses: [...state.expenses, expense] };
  }),
  on(CashFlowActions.addExpenseSuccess, (state): State => {
    return { ...state };
  }),
  on(CashFlowActions.addExpenseFailure, (state): State => {
    return { ...state };
  }),

  on(CashFlowActions.removeExpense, (state, { expenseId }): State => {
    const filteredExpenses: CashFlow[] = state.expenses.filter((expense: CashFlow): boolean => expense.id !== expenseId);
    return { ...state, expenses: filteredExpenses };
  }),

  on(CashFlowActions.updateExpense, (state, { updatedExpense }): State => {
    const expenses: CashFlow[] = state.expenses.map((expense: CashFlow) => {
      return expense.id === updatedExpense.id ? updatedExpense : expense;
    });

    return { ...state, expenses };
  }),
  on(CashFlowActions.updateExpenseSuccess, (state): State => {
    return { ...state };
  }),
  on(CashFlowActions.updateExpenseFailure, (state): State => {
    return { ...state };
  }),

  on(AuthActions.signOut, (): State => {
    return { incomes: [], expenses: [], isLoading: false };
  })
);
