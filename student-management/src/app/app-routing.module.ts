import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentRegistrationComponent } from './student-registration/student-registration.component';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentDetailsComponent } from './student-details/student-details.component';
import { ErrorComponent } from './error/error.component';
import { StudentEditComponent } from './student-edit/student-edit.component';

const routes: Routes = [
  // { path: '', redirectTo: '/students', pathMatch: 'full' },
  { path: '', component: StudentListComponent },
  { path: 'register', component: StudentRegistrationComponent },
  { path: 'students', component: StudentListComponent },
  { path: 'students/:id', component: StudentDetailsComponent },
  { path: 'edit/:id', component: StudentEditComponent },
  { path: 'error', component: ErrorComponent },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
