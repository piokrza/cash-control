import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';

import { LoginForm } from '#pages/auth/models';
import { AuthFormService } from '#pages/auth/services';
import { AuthActions, AuthSelectors } from '#store/auth';

@UntilDestroy()
@Component({
  selector: 'ctrl-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  private readonly store: Store = inject(Store);

  public readonly form: FormGroup<LoginForm> = inject(AuthFormService).loginForm;

  public readonly errorMessage$: Observable<string | null> = this.store.select(AuthSelectors.errorMessage).pipe(
    tap((errorMessage) => {
      typeof errorMessage === 'string' && setTimeout(() => this.store.dispatch(AuthActions.resetErrorMessage()), 4000);
    })
  );

  public signinWithGoogle(): void {
    this.store.dispatch(AuthActions.signInWithGoogle());
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.store.dispatch(AuthActions.signInWithEmailAndPassword({ payload: this.form.getRawValue() }));
  }
}
