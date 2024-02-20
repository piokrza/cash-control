import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, filter, map } from 'rxjs';

import { ConfirmationService, PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';

import { AuthActions, AuthSelectors } from '#auth/store';
import { AppPaths } from '#core/enums';
import { MenuService, TitleService } from '#core/services';
import { connectState } from '#core/utils';
import { ContainerComponent } from '#shared/components';
import { WeatherWidgetComponent } from '#weather/components';

const imports = [
  RouterLink,
  FormsModule,
  ToastModule,
  ButtonModule,
  SidebarModule,
  TranslateModule,
  RouterLinkActive,
  ContainerComponent,
  ConfirmDialogModule,
  WeatherWidgetComponent,
];

@Component({
  selector: 'org-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports,
})
export class LayoutComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly menuService = inject(MenuService);
  private readonly titleService = inject(TitleService);
  private readonly translateService = inject(TranslateService);
  private readonly confirmationService = inject(ConfirmationService);

  readonly state = connectState(this.destroyRef, {
    user: this.store.select(AuthSelectors.user),
    links: this.menuService.links$,
    title: this.titleService.title$,
    isTitleVisible: this.isTitleVisible$,
  });

  sidebarVisible = false;
  readonly PrimeIcons: typeof PrimeIcons = PrimeIcons;

  authorize(): void {
    this.state.user &&
      this.confirmationService.confirm({
        message: this.translateService.instant('auth.signoutMessage'),
        header: this.translateService.instant('auth.signout'),
        accept: () => this.store.dispatch(AuthActions.signOut()),
      });

    !this.state.user && this.router.navigate([AppPaths.AUTHENTICATION]);

    this.sidebarVisible = false;
  }

  get isTitleVisible$(): Observable<boolean> {
    return this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(({ url }) => url.includes(AppPaths.AUTHENTICATION) || url === '/')
    );
  }
}
