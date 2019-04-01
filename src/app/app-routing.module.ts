import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { LoginComponent } from './_shared/authentication/login/login.component';
import { RegistrationComponent } from './_shared/authentication/registration/registration.component';
import { MainPageAdminComponent } from './components/admin/main-page-admin/main-page-admin.component';
import { ViewTestComponent } from './components/admin/view-test/view-test.component';
import { UserComponent } from './_shared/authentication/user/user.component';
import { AuthGuard } from './_shared/authentication/Guard/auth.guard';


const routes: Routes = [
  {path: '', component: MainPageComponent, canActivate:[AuthGuard]},
  {path: 'login', component: UserComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'admin', component: MainPageAdminComponent, canActivate:[AuthGuard]},
  {path: 'test-view', component: ViewTestComponent, canActivate:[AuthGuard]}

 // {path: '', redirectTo: '/login', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
