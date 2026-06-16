import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ApiService, Vuelo, NuevoVuelo } from '../api.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-vuelos',
  imports: [RouterLink, FormsModule],
  templateUrl: './vuelos.component.html',
  styleUrl: './vuelos.component.css',
})
export class VuelosComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  vuelos = signal<Vuelo[]>([]);
  error = signal<string | null>(null);
  esAdmin = computed(() => this.auth.usuario()?.role === 'admin');

  // Charts
  porAerolinea = computed(() => this.agrupar('aerolinea'));
  porOrigen = computed(() => this.agrupar('origen'));
  porDestino = computed(() => this.agrupar('destino'));

  // Add form
  mostrarFormulario = false;
  formulario: NuevoVuelo = { origen: '', destino: '', hora_salida: '', hora_llegada: '', aerolinea: '' };

  // Edit state
  editando: Vuelo | null = null;
  editForm: NuevoVuelo = { origen: '', destino: '', hora_salida: '', hora_llegada: '', aerolinea: '' };

  private agrupar(campo: keyof Vuelo): { nombre: string; total: number }[] {
    const conteo: Record<string, number> = {};
    for (const v of this.vuelos()) {
      const clave = String(v[campo]);
      conteo[clave] = (conteo[clave] ?? 0) + 1;
    }
    return Object.entries(conteo).map(([nombre, total]) => ({ nombre, total }));
  }

  maxDe(items: { total: number }[]): number {
    return Math.max(...items.map((e) => e.total), 1);
  }

  centroX(idx: number, n: number): number {
    return 30 + idx * (340 / n) + 340 / n / 2;
  }

  barX(idx: number, n: number): number {
    const slot = 340 / n;
    return 30 + idx * slot + slot * 0.15;
  }

  barAncho(n: number): number {
    return (340 / n) * 0.7;
  }

  ngOnInit(): void {
    this.cargarVuelos();
  }

  cargarVuelos(): void {
    this.api.vuelos().subscribe({
      next: (res) => this.vuelos.set(res),
      error: (err) => this.error.set(err.message ?? 'Request failed'),
    });
  }

  agregarVuelo(): void {
    const userId = this.auth.usuario()!.id;
    this.api.crearVuelo(userId, this.formulario).subscribe({
      next: (v) => {
        this.vuelos.update((list) => [...list, v]);
        this.formulario = { origen: '', destino: '', hora_salida: '', hora_llegada: '', aerolinea: '' };
        this.mostrarFormulario = false;
      },
      error: (err) => this.error.set(err.error?.error ?? 'Error al crear vuelo'),
    });
  }

  iniciarEdicion(v: Vuelo): void {
    this.editando = v;
    this.editForm = { origen: v.origen, destino: v.destino, hora_salida: v.hora_salida, hora_llegada: v.hora_llegada, aerolinea: v.aerolinea };
  }

  guardarEdicion(): void {
    if (!this.editando) return;
    const userId = this.auth.usuario()!.id;
    this.api.actualizarVuelo(this.editando.id, userId, this.editForm).subscribe({
      next: (actualizado) => {
        this.vuelos.update((list) => list.map((v) => (v.id === actualizado.id ? actualizado : v)));
        this.editando = null;
      },
      error: (err) => this.error.set(err.error?.error ?? 'Error al actualizar vuelo'),
    });
  }

  cancelarEdicion(): void {
    this.editando = null;
  }

  eliminarVuelo(id: number): void {
    const userId = this.auth.usuario()!.id;
    this.api.eliminarVuelo(id, userId).subscribe({
      next: () => this.vuelos.update((list) => list.filter((v) => v.id !== id)),
      error: (err) => this.error.set(err.error?.error ?? 'Error al eliminar vuelo'),
    });
  }
}
