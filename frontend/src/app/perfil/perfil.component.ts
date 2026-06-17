import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';

const COLORES_AVATAR = ['#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#db2777'];

@Component({
  selector: 'app-perfil',
  imports: [RouterLink, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);

  usuario = this.auth.usuario;

  iniciales = computed(() => {
    const nombre = this.usuario()?.nombre?.trim() ?? '';
    if (nombre === '') return '?';
    const partes = nombre.split(/\s+/);
    const primera = partes[0]?.[0] ?? '';
    const segunda = partes.length > 1 ? partes[partes.length - 1][0] : '';
    return (primera + segunda).toUpperCase();
  });

  colorAvatar = computed(() => {
    const nombre = this.usuario()?.nombre ?? '';
    let hash = 0;
    for (let i = 0; i < nombre.length; i++) hash = (hash + nombre.charCodeAt(i)) % COLORES_AVATAR.length;
    return COLORES_AVATAR[hash];
  });

  avatarError = signal<string | null>(null);
  subiendoAvatar = signal(false);

  // Name form
  nuevoNombre = '';
  nombreExito = signal(false);
  nombreError = signal<string | null>(null);

  // Password form
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordExito = signal(false);
  passwordError = signal<string | null>(null);

  // Passenger link form
  inputTelefono = '';
  pasajeroExito = signal(false);
  pasajeroError = signal<string | null>(null);

  ngOnInit(): void {
    if (!this.auth.usuario()) {
      this.router.navigate(['/login']);
      return;
    }
    this.nuevoNombre = this.auth.usuario()!.nombre;
    this.inputTelefono = this.auth.usuario()!.telefono ?? '';
  }

  guardarNombre(): void {
    this.nombreError.set(null);
    this.nombreExito.set(false);

    if (this.nuevoNombre.trim() === '') {
      this.nombreError.set('El nombre no puede estar vacío');
      return;
    }

    const u = this.usuario()!;
    this.api.actualizarPerfil(u.id, this.nuevoNombre.trim(), undefined, undefined, u.telefono).subscribe({
      next: (updated) => {
        this.auth.actualizarDatos(updated);
        this.nombreExito.set(true);
      },
      error: (err) => this.nombreError.set(err.error?.error ?? 'Error al guardar'),
    });
  }

  cambiarPassword(): void {
    this.passwordError.set(null);
    this.passwordExito.set(false);

    if (this.currentPassword === '') {
      this.passwordError.set('Ingresa tu contraseña actual');
      return;
    }
    if (this.newPassword.length < 6) {
      this.passwordError.set('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError.set('Las contraseñas nuevas no coinciden');
      return;
    }

    const u = this.usuario()!;
    this.api.actualizarPerfil(u.id, u.nombre, this.currentPassword, this.newPassword, u.telefono).subscribe({
      next: (updated) => {
        this.auth.actualizarDatos(updated);
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.passwordExito.set(true);
      },
      error: (err) => this.passwordError.set(err.error?.error ?? 'Error al cambiar contraseña'),
    });
  }

  vincularTelefono(): void {
    this.pasajeroError.set(null);
    this.pasajeroExito.set(false);

    const u = this.usuario()!;
    const tel = this.inputTelefono.trim() || null;
    this.api.actualizarPerfil(u.id, u.nombre, undefined, undefined, tel).subscribe({
      next: (updated) => {
        this.auth.actualizarDatos(updated);
        this.inputTelefono = updated.telefono ?? '';
        this.pasajeroExito.set(true);
      },
      error: (err) => this.pasajeroError.set(err.error?.error ?? 'Error al vincular teléfono'),
    });
  }

  desvincularTelefono(): void {
    this.inputTelefono = '';
    this.vincularTelefono();
  }

  cambiarAvatar(event: Event): void {
    this.avatarError.set(null);
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo) return;

    this.subiendoAvatar.set(true);
    const userId = this.usuario()!.id;
    this.api.subirAvatar(userId, archivo).subscribe({
      next: ({ avatar }) => {
        this.auth.actualizarDatos({ ...this.usuario()!, avatar });
        this.subiendoAvatar.set(false);
        input.value = '';
      },
      error: (err) => {
        this.avatarError.set(err.error?.error ?? 'Error al subir la imagen');
        this.subiendoAvatar.set(false);
        input.value = '';
      },
    });
  }
}
