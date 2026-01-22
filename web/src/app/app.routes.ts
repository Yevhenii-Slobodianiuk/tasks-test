import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

import { LoginComponent } from './pages/login/login';
import { TasksListComponent } from './pages/tasks-list/tasks-list';
import { TaskDetailComponent } from './pages/task-detail/task-detail';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tasks' },

  { path: 'login', component: LoginComponent },

  { path: 'tasks', component: TasksListComponent, canActivate: [authGuard] },
  { path: 'tasks/:id', component: TaskDetailComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: 'tasks' },
];
