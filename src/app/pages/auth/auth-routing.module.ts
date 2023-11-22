import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthViewComponent } from '#auth/.';
import { LoginFormComponent, RegisterFormComponent } from '#auth/components';

const routes: Routes = [
  {
    path: '',
    component: AuthViewComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginFormComponent },
      { path: 'register', component: RegisterFormComponent },
    ],
  },
];
@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class AuthRoutingModule {}
