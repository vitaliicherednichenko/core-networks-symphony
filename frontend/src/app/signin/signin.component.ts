import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MyErrorStateMatcher} from '../login/login.component';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-signin',
  imports: [RouterLink, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  private api = inject(ApiService);

  matcher = new MyErrorStateMatcher();
  submitting = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  signinForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(50)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    nombre: new FormControl('', [Validators.required, Validators.maxLength(50)]),
  });

  onSubmit(): void {
    if (this.signinForm.invalid) {
      this.signinForm.markAllAsTouched();
      return;
    }

    const { nombre, email, password } = this.signinForm.getRawValue();

    this.submitting.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.api.crearUsuario({ nombre: nombre!, email: email!, password: password! }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.successMessage.set('Usuario creado correctamente');
        this.signinForm.reset();
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(err.error?.error ?? 'No se pudo crear el usuario');
      },
    });
  }
}

