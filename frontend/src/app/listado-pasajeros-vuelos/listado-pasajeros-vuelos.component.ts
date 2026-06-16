import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ApiService, ListadoPasajeroVuelo, NuevoListadoPasajeroVuelo } from '../api.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-listado-pasajeros-vuelos',
  imports: [RouterLink, FormsModule],
  templateUrl: './listado-pasajeros-vuelos.component.html',
  styleUrl: './listado-pasajeros-vuelos.component.css',
})
export class ListadoPasajerosVuelosComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  listado = signal<ListadoPasajeroVuelo[]>([]);
  error = signal<string | null>(null);
  esAdmin = computed(() => this.auth.usuario()?.role === 'admin');

  mostrarFormulario = false;
  formulario: NuevoListadoPasajeroVuelo = { id_vuelo: 0, id_pasajero: 0, fecha: '' };

  editandoKey: string | null = null;
  editFecha = '';

  private clave(l: ListadoPasajeroVuelo): string {
    return `${l.id_vuelo}|${l.id_pasajero}`;
  }

  ngOnInit(): void {
    this.api.listadoPasajerosVuelos().subscribe({
      next: (res) => this.listado.set(res),
      error: (err) => this.error.set(err.message ?? 'Request failed'),
    });
  }

  agregar(): void {
    const userId = this.auth.usuario()!.id;
    this.api.crearListadoPasajeroVuelo(userId, this.formulario).subscribe({
      next: (l) => {
        this.listado.update((list) => [...list, l]);
        this.formulario = { id_vuelo: 0, id_pasajero: 0, fecha: '' };
        this.mostrarFormulario = false;
      },
      error: (err) => this.error.set(err.error?.error ?? 'Error al crear registro'),
    });
  }

  iniciarEdicion(l: ListadoPasajeroVuelo): void {
    this.editandoKey = this.clave(l);
    this.editFecha = l.fecha;
  }

  guardarEdicion(l: ListadoPasajeroVuelo): void {
    const userId = this.auth.usuario()!.id;
    const payload: NuevoListadoPasajeroVuelo = { id_vuelo: l.id_vuelo, id_pasajero: l.id_pasajero, fecha: this.editFecha };
    this.api.actualizarListadoPasajeroVuelo(userId, payload).subscribe({
      next: (updated) => {
        this.listado.update((list) => list.map((it) => this.clave(it) === this.clave(l) ? { ...it, fecha: updated.fecha } : it));
        this.editandoKey = null;
      },
      error: (err) => this.error.set(err.error?.error ?? 'Error al actualizar registro'),
    });
  }

  cancelarEdicion(): void { this.editandoKey = null; }

  eliminar(l: ListadoPasajeroVuelo): void {
    const userId = this.auth.usuario()!.id;
    this.api.eliminarListadoPasajeroVuelo(userId, l.id_vuelo, l.id_pasajero).subscribe({
      next: () => this.listado.update((list) => list.filter((it) => this.clave(it) !== this.clave(l))),
      error: (err) => this.error.set(err.error?.error ?? 'Error al eliminar registro'),
    });
  }
}
