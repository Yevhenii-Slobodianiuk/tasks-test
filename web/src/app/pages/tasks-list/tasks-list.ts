import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { TasksService, Task } from '../../services/tasks';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tasks-list.html',
  styleUrl: './tasks-list.scss',
})
export class TasksListComponent {
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  tasks$: Observable<Task[]>;
  createTitle = '';
  creating = false;
  createError: string | null = null;

  constructor(
    private readonly tasksService: TasksService,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {
    this.tasks$ = this.refresh$.pipe(switchMap(() => this.tasksService.getTasks()));
  }

  reload() {
    this.refresh$.next();
  }

  createTask() {
    this.createError = null;

    const title = this.createTitle.trim();
    if (title.length < 3) {
      this.createError = 'Title must be at least 3 characters';
      return;
    }

    this.creating = true;

    this.tasksService.createTask(title).subscribe({
      next: () => {
        this.creating = false;
        this.createTitle = '';
        this.reload();
      },
      error: (err) => {
        console.error('Create task failed', err);
        this.creating = false;

        const msg = err?.error?.error?.message || err?.error?.message || 'Failed to create task';
        this.createError = msg;
      },
    });
  }

  onTitleInput(event: Event) {
    this.createTitle = (event.target as HTMLInputElement).value;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
