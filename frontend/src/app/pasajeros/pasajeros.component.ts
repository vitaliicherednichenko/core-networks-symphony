import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ApiService, Pasajero, NuevoPasajero } from '../api.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-pasajeros',
  imports: [RouterLink, FormsModule],
  templateUrl: './pasajeros.component.html',
  styleUrl: './pasajeros.component.css',
})
export class PasajerosComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  pasajeros = signal<Pasajero[]>([]);
  error = signal<string | null>(null);
  esAdmin = computed(() => this.auth.usuario()?.role === 'admin');

  mostrarFormulario = false;
  formulario: NuevoPasajero = { nro_pasaporte: '', apellido: '', nombre: '', fecha_nacimiento: '', sexo: '', direccion: '', telefono: '' };

  editando: Pasajero | null = null;
  editForm: NuevoPasajero = { nro_pasaporte: '', apellido: '', nombre: '', fecha_nacimiento: '', sexo: '', direccion: '', telefono: '' };

  ngOnInit(): void {
    this.api.pasajeros().subscribe({
      next: (res) => this.pasajeros.set(res),
      error: (err) => this.error.set(err.message ?? 'Request failed'),
    });
  }

  agregar(): void {
    const userId = this.auth.usuario()!.id;
    this.api.crearPasajero(userId, this.formulario).subscribe({
      next: (p) => {
        this.pasajeros.update((list) => [...list, p]);
        this.formulario = { nro_pasaporte: '', apellido: '', nombre: '', fecha_nacimiento: '', sexo: '', direccion: '', telefono: '' };
        this.mostrarFormulario = false;
      },
      error: (err) => this.error.set(err.error?.error ?? 'Error al crear pasajero'),
    });
  }

  iniciarEdicion(p: Pasajero): void {
    this.editando = p;
    this.editForm = { nro_pasaporte: p.nro_pasaporte, apellido: p.apellido, nombre: p.nombre, fecha_nacimiento: p.fecha_nacimiento, sexo: p.sexo, direccion: p.direccion, telefono: p.telefono };
  }

  guardarEdicion(): void {
    if (!this.editando) return;
    const userId = this.auth.usuario()!.id;
    this.api.actualizarPasajero(this.editando.id_pasajero, userId, this.editForm).subscribe({
      next: (updated) => {
        this.pasajeros.update((list) => list.map((p) => (p.id_pasajero === updated.id_pasajero ? updated : p)));
        this.editando = null;
      },
      error: (err) => this.error.set(err.error?.error ?? 'Error al actualizar pasajero'),
    });
  }

  cancelarEdicion(): void { this.editando = null; }

  eliminar(id: number): void {
    const userId = this.auth.usuario()!.id;
    this.api.eliminarPasajero(id, userId).subscribe({
      next: () => this.pasajeros.update((list) => list.filter((p) => p.id_pasajero !== id)),
      error: (err) => this.error.set(err.error?.error ?? 'Error al eliminar pasajero'),
    });
  }
}
