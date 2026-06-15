import { Injectable, signal } from '@angular/core';

import { Usuario } from './api.service';

const STORAGE_KEY = 'usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  usuario = signal<Usuario | null>(this.cargarUsuario());

  login(usuario: Usuario): void {
    this.usuario.set(usuario);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
  }

  logout(): void {
    this.usuario.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  private cargarUsuario(): Usuario | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Usuario) : null;
  }
}
