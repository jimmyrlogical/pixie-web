import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './account/login/login.component';
import { IndexComponent } from './index/index.component';
import { DashboardComponent } from './users/dashboard/dashboard.component';
import { SettingComponent } from './users/setting/setting.component';
import { RegisterComponent } from './account/register/register.component';
import { ForgotPasswordComponent } from './account/forgot-password/forgot-password.component';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { TermsUseComponent } from './users/terms-use/terms-use.component';

import * as $ from 'jquery';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    IndexComponent,
    DashboardComponent,
    SettingComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    TermsUseComponent,
  ],
  imports: [
    BsDatepickerModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    TooltipModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
