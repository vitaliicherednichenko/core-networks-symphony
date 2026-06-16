import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ApiService, Usuario, NuevoUsuario, ActualizarUsuario } from '../api.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-usuarios',
  imports: [RouterLink, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  usuarios = signal<Usuario[]>([]);
  error = signal<string | null>(null);
  esAdmin = computed(() => this.auth.usuario()?.role === 'admin');
  sesionId = computed(() => this.auth.usuario()?.id);

  mostrarFormulario = false;
  formulario: NuevoUsuario = { nombre: '', email: '', password: '' };

  editando: Usuario | null = null;
  editForm: ActualizarUsuario & { password: string } = { nombre: '', email: '', role: 'user', password: '' };

  ngOnInit(): void {
    this.api.usuarios().subscribe({
      next: (res) => this.usuarios.set(res),
      error: (err) => this.error.set(err.message ?? 'Request failed'),
    });
  }

  agregar(): void {
    const userId = this.auth.usuario()!.id;
    this.api.crearUsuario(this.formulario).subscribe({
      next: (u) => {
        this.usuarios.update((list) => [...list, u]);
        this.formulario = { nombre: '', email: '', password: '' };
        this.mostrarFormulario = false;
      },
      error: (err) => this.error.set(err.error?.error ?? 'Error al crear usuario'),
    });
  }

  iniciarEdicion(u: Usuario): void {
    this.editando = u;
    this.editForm = { nombre: u.nombre, email: u.email, role: u.role, password: '' };
  }

  guardarEdicion(): void {
    if (!this.editando) return;
    const userId = this.auth.usuario()!.id;
    const payload: ActualizarUsuario = { nombre: this.editForm.nombre, email: this.editForm.email, role: this.editForm.role };
    if (this.editForm.password !== '') payload.password = this.editForm.password;
    this.api.actualizarUsuario(this.editando.id, userId, payload).subscribe({
      next: (updated) => {
        this.usuarios.update((list) => list.map((u) => (u.id === updated.id ? updated : u)));
        this.editando = null;
      },
      error: (err) => this.error.set(err.error?.error ?? 'Error al actualizar usuario'),
    });
  }

  cancelarEdicion(): void { this.editando = null; }

  eliminar(id: number): void {
    const userId = this.auth.usuario()!.id;
    this.api.eliminarUsuario(id, userId).subscribe({
      next: () => this.usuarios.update((list) => list.filter((u) => u.id !== id)),
      error: (err) => this.error.set(err.error?.error ?? 'Error al eliminar usuario'),
    });
  }
}
