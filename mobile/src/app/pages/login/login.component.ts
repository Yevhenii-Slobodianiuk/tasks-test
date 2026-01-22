import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
} from '@ionic/angular/standalone';

import { AuthService } from '../../services/auth.js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonText,
  ],
  templateUrl: './login.component.html',
})
export class LoginPage {
  email = 'test@example.com';
  password = '123456';

  loading = false;
  error: string | null = null;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  submit() {
    this.error = null;

    if (!this.email || !this.password) {
      this.error = 'Email and password are required';
      return;
    }

    this.loading = true;

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.loading = false;
        this.error = 'Invalid credentials';
      },
    });
  }
}
