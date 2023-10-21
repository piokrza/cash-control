import { Component, inject, OnInit } from '@angular/core';
import { isLightMode } from '@common/constants';
import { PersistanceService, ThemeService } from '@common/services';
import { Store } from '@ngrx/store';
import { AuthService } from '@pages/auth/services';
import { AuthActions } from '@store/auth';
import { CashFlowActions } from '@store/cash-flow';
import { CategoriesActions } from '@store/categories';
import firebase from 'firebase/compat';
import { PrimeNGConfig } from 'primeng/api';
import { tap } from 'rxjs';

@Component({
  selector: 'ctrl-root',
  template: `
    <main class="h-[calc(100vh-82px)] xl:h-screen">
      <router-outlet></router-outlet>
    </main>

    <p-toast position="top-right" />
    <p-confirmDialog />
  `,
})
export class AppComponent implements OnInit {
  private store: Store = inject(Store);
  private authState: AuthService = inject(AuthService);
  private themeService: ThemeService = inject(ThemeService);
  private primengConfig: PrimeNGConfig = inject(PrimeNGConfig);

  private isLightMode: boolean | null = inject(PersistanceService).get<boolean>(isLightMode);

  public ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.themeService.setTheme(this.isLightMode);

    this.authState.authState$
      .pipe(
        tap((user: firebase.User | null): void => {
          user && this.dispatchStoreActions(user.uid);
        })
      )
      .subscribe();
  }

  private dispatchStoreActions(uid: string): void {
    this.store.dispatch(CategoriesActions.getCategories());
    this.store.dispatch(AuthActions.loadUserData());
    this.store.dispatch(CashFlowActions.getCashFlowUserData({ uid }));
  }
}
