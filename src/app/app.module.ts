import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './_shared/authentication/login/login.component';
import { RegistrationComponent } from './_shared/authentication/registration/registration.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { MainPageAdminComponent } from './admin-panel/main-page-admin/main-page-admin.component';

import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { from } from 'rxjs';
import { TestService } from './services/test.service';
import { ViewTestComponent } from './admin-panel/view-test/view-test.component';
import { UserService } from './_shared/authentication/auth services/user.service';
import { UserComponent } from './_shared/authentication/user/user.component';
import { AuthGuard } from './_shared/authentication/Guard/auth.guard';
import { AuthInterceptor } from './_shared/authentication/auth.interceptor';
import { ForbiddenComponent } from './_shared/forbidden/forbidden.component';
import { ViewQuestionComponent } from './admin-panel/view-question/view-question.component';
import { TestProcessComponent } from './components/test-process/test-process.component';
import { TestResultComponent } from './components/test-result/test-result.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    MainPageComponent,
    MainPageAdminComponent,
    ViewTestComponent,
    UserComponent,
    ForbiddenComponent,
    ViewQuestionComponent,
    TestProcessComponent,
    TestResultComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [TestService, UserService, AuthGuard,
  {
    provide: HTTP_INTERCEPTORS,
    useClass : AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
