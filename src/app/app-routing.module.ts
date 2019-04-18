import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { RegistrationComponent } from './_shared/authentication/registration/registration.component';
import { MainPageAdminComponent } from './admin-panel/main-page-admin/main-page-admin.component';
import { ViewTestComponent } from './admin-panel/view-test/view-test.component';
import { UserComponent } from './_shared/authentication/user/user.component';
import { AuthGuard } from './_shared/authentication/Guard/auth.guard';
import { ForbiddenComponent } from './_shared/forbidden/forbidden.component';
import { ViewQuestionComponent } from './admin-panel/view-question/view-question.component';
import { TestProcessComponent } from './components/test-process/test-process.component';
import { TestResultComponent } from './components/test-result/test-result.component';



const routes: Routes = [
  {path: '', component: MainPageComponent, canActivate: [AuthGuard]},
  {path: 'test', component: TestProcessComponent, canActivate: [AuthGuard]},
  {path: 'results', component: TestResultComponent, canActivate: [AuthGuard]},
  {path: 'login', component: UserComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'admin', component: MainPageAdminComponent, canActivate: [AuthGuard], data : { roles: ['Admin', 'SuperAdmin'] }},
  {path: 'test-view', component: ViewTestComponent, canActivate: [AuthGuard], data : { roles: ['Admin', 'SuperAdmin'] }},
  {path: 'forbidden', component: ForbiddenComponent, canActivate: [AuthGuard]},
  {path: 'question-view', component: ViewQuestionComponent, canActivate: [AuthGuard], data : { roles: ['Admin', 'SuperAdmin'] }},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
