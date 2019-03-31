import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './_shared/authentication/login/login.component';
import { RegistrationComponent } from './_shared/authentication/registration/registration.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { MainPageAdminComponent } from './components/admin/main-page-admin/main-page-admin.component';

import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { from } from 'rxjs';
import { TestService } from './services/test.service';
import { ViewTestComponent } from './components/admin/view-test/view-test.component';
import { UserService } from './_shared/authentication/auth services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    MainPageComponent,
    MainPageAdminComponent,
    ViewTestComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [TestService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
