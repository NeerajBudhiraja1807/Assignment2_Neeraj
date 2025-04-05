import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { EmployeeAddComponent } from './employee/employee-add/employee-add.component';
import { EmployeeEditComponent } from './employee/employee-edit/employee-edit.component';
import { EmployeeDetailComponent } from './employee/employee-detail/employee-detail.component';
import { EmployeeSearchComponent } from './employee/employee-search/employee-search.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'employees', component: EmployeeListComponent, canActivate: [AuthGuard] },
  { path: 'employees/add', component: EmployeeAddComponent, canActivate: [AuthGuard] },
  { path: 'employees/edit/:id', component: EmployeeEditComponent, canActivate: [AuthGuard] },
  { path: 'employees/detail/:id', component: EmployeeDetailComponent, canActivate: [AuthGuard] },
  { path: 'employees/search', component: EmployeeSearchComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/employees', pathMatch: 'full' },
  { path: '**', redirectTo: '/employees' }
];

