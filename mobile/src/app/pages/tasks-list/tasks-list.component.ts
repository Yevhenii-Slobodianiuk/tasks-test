import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonButton,
} from '@ionic/angular/standalone';

import { Observable } from 'rxjs';
import { TasksService, Task } from '../../services/tasks.service';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    IonButton,
  ],
  templateUrl: './tasks-list.component.html',
})
export class TasksListPage {
  tasks$: Observable<Task[]>;

  constructor(
    private readonly tasksService: TasksService,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {
    this.tasks$ = this.tasksService.getTasks();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
