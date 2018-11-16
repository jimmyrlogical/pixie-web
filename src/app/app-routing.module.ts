import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';

import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { ForgotPasswordComponent } from './account/forgot-password/forgot-password.component';

import { DashboardComponent } from './users/dashboard/dashboard.component';
import { SettingComponent } from './users/setting/setting.component';
import { TermsUseComponent } from './users/terms-use/terms-use.component';


const routes: Route[] = [
  {path: '', redirectTo: '/index', pathMatch: 'full'} ,
  {path: 'index', component: IndexComponent} ,
  {path: 'login', component: LoginComponent} ,
  {path: 'register', component: RegisterComponent} ,
  {path: 'forgotpassword', component: ForgotPasswordComponent} ,
  {path: 'dashboard', component: DashboardComponent},
  {path: 'setting', component: SettingComponent},
  {path: 'termsuse', component: TermsUseComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})

export class AppRoutingModule { }
