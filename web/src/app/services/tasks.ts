import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type Note = {
  id: string;
  text: string;
  tags: string[];
  createdAt: string;
  taskId: string;
};

export type Task = {
  id: string;
  title: string;
  slug: string;
  important: boolean;
  createdAt: string;
  notes: Note[];
};

@Injectable({ providedIn: 'root' })
export class TasksService {
  constructor(private readonly http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>('/api/tasks');
  }

  createTask(title: string): Observable<Task> {
    return this.http.post<Task>('/api/tasks', { title });
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`/api/tasks/${encodeURIComponent(id)}`);
  }

  addNote(taskId: string, text: string): Observable<Task> {
    return this.http.post<Task>(`/api/tasks/${encodeURIComponent(taskId)}/notes`, { text });
  }
}
