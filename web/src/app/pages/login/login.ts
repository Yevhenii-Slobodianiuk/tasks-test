import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.js';
import { CommonModule } from '@angular/common';
import type { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  error: string | null = null;
  loading = false;

  form: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {
    this.form = this.fb.group({
      email: ['test@example.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required]],
    });
  }

  submit() {
    this.error = null;

    if (this.form.invalid) {
      this.error = 'Please enter a valid email and password.';
      return;
    }

    const { email, password } = this.form.value as { email: string; password: string };
    this.loading = true;

    this.auth.login(email, password).subscribe({
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
