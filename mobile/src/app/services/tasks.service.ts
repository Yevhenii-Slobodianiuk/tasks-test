import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type Task = {
  id: string;
  title: string;
  slug: string;
  important: boolean;
  createdAt: string;
};

@Injectable({ providedIn: 'root' })
export class TasksService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private readonly http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/api/tasks`);
  }
}
