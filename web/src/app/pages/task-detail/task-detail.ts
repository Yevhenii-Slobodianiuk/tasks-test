import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';

import { TasksService, Task } from '../../services/tasks';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.scss',
})
export class TaskDetailComponent {
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  taskId: string;
  task$: Observable<Task>;

  noteText = '';
  adding = false;
  addError: string | null = null;

  private readonly tagRe = /(^|\s)#([\p{L}\p{N}_-]+)(?=\s|$)/gu;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly tasksService: TasksService,
    private readonly auth: AuthService,
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.taskId = '';
      this.router.navigate(['/tasks']);
      this.task$ = this.refresh$.pipe(switchMap(() => this.tasksService.getTaskById('')));
      return;
    }

    this.taskId = id;
    this.task$ = this.refresh$.pipe(switchMap(() => this.tasksService.getTaskById(this.taskId)));
  }

  reload() {
    this.refresh$.next();
  }

  private extractTags(input: string): string[] {
    const tags = new Set<string>();
    let m: RegExpExecArray | null;

    this.tagRe.lastIndex = 0;
    while ((m = this.tagRe.exec(input)) !== null) {
      tags.add(m[2].toLowerCase());
    }

    return [...tags];
  }

  private removeTagsFromText(input: string): string {
    return input.replace(this.tagRe, ' ').replace(/\s+/g, ' ').trim();
  }

  addNote() {
    this.addError = null;

    const raw = this.noteText ?? '';
    const trimmed = raw.trim();

    if (!trimmed) {
      this.addError = 'Note text cannot be empty';
      return;
    }

    const contentWithoutTags = this.removeTagsFromText(raw);
    if (!contentWithoutTags) {
      this.addError = 'Note content cannot be empty after removing tags';
      return;
    }

    this.adding = true;

    this.tasksService
      .addNote(this.taskId, trimmed)
      .pipe(finalize(() => (this.adding = false)))
      .subscribe({
        next: () => {
          this.noteText = '';
          this.reload();
        },
        error: (err) => {
          console.error('Add note failed', err);
          const msg = err?.error?.error?.message || err?.error?.message || 'Failed to add note';
          this.addError = msg;
        },
      });
  }

  backToList() {
    this.router.navigate(['/tasks']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
