import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ApiService, Itinerario, NuevoItinerario } from '../api.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-itinerarios',
  imports: [RouterLink, FormsModule],
  templateUrl: './itinerarios.component.html',
  styleUrl: './itinerarios.component.css',
})
export class ItinerariosComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  itinerarios = signal<Itinerario[]>([]);
  error = signal<string | null>(null);
  esAdmin = computed(() => this.auth.usuario()?.role === 'admin');

  mostrarFormulario = false;
  formulario: NuevoItinerario = { id_reserva: 0, trayecto: '', tramo: '', id_vuelo: null, fecha_vuelo: '' };

  editandoKey: string | null = null;
  editForm: { id_vuelo: number | null; fecha_vuelo: string } = { id_vuelo: null, fecha_vuelo: '' };

  private clave(i: Itinerario): string {
    return `${i.id_reserva}|${i.trayecto}|${i.tramo}`;
  }

  ngOnInit(): void {
    this.api.itinerarios().subscribe({
      next: (res) => this.itinerarios.set(res),
      error: (err) => this.error.set(err.message ?? 'Request failed'),
    });
  }

  agregar(): void {
    const userId = this.auth.usuario()!.id;
    this.api.crearItinerario(userId, this.formulario).subscribe({
      next: (it) => {
        this.itinerarios.update((list) => [...list, it]);
        this.formulario = { id_reserva: 0, trayecto: '', tramo: '', id_vuelo: null, fecha_vuelo: '' };
        this.mostrarFormulario = false;
      },
      error: (err) => this.error.set(err.error?.error ?? 'Error al crear itinerario'),
    });
  }

  iniciarEdicion(i: Itinerario): void {
    this.editandoKey = this.clave(i);
    this.editForm = { id_vuelo: i.id_vuelo, fecha_vuelo: i.fecha_vuelo };
  }

  guardarEdicion(i: Itinerario): void {
    const userId = this.auth.usuario()!.id;
    const payload: NuevoItinerario = { id_reserva: i.id_reserva, trayecto: i.trayecto, tramo: i.tramo, ...this.editForm };
    this.api.actualizarItinerario(userId, payload).subscribe({
      next: (updated) => {
        this.itinerarios.update((list) => list.map((it) => this.clave(it) === this.clave(i) ? { ...it, ...updated } : it));
        this.editandoKey = null;
      },
      error: (err) => this.error.set(err.error?.error ?? 'Error al actualizar itinerario'),
    });
  }

  cancelarEdicion(): void { this.editandoKey = null; }

  eliminar(i: Itinerario): void {
    const userId = this.auth.usuario()!.id;
    this.api.eliminarItinerario(userId, i.id_reserva, i.trayecto, i.tramo).subscribe({
      next: () => this.itinerarios.update((list) => list.filter((it) => this.clave(it) !== this.clave(i))),
      error: (err) => this.error.set(err.error?.error ?? 'Error al eliminar itinerario'),
    });
  }
}
