import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ApiService, DetalleViajero, NuevoDetalleViajero } from '../api.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-detalles-viajeros',
  imports: [RouterLink, FormsModule],
  templateUrl: './detalles-viajeros.component.html',
  styleUrl: './detalles-viajeros.component.css',
})
export class DetallesViajerosComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  detalles = signal<DetalleViajero[]>([]);
  error = signal<string | null>(null);
  esAdmin = computed(() => this.auth.usuario()?.role === 'admin');

  mostrarFormulario = false;
  formulario: NuevoDetalleViajero = { id_reserva: 0, id_pasajero: 0 };

  ngOnInit(): void {
    this.api.detallesViajeros().subscribe({
      next: (res) => this.detalles.set(res),
      error: (err) => this.error.set(err.message ?? 'Request failed'),
    });
  }

  agregar(): void {
    const userId = this.auth.usuario()!.id;
    this.api.crearDetalleViajero(userId, this.formulario).subscribe({
      next: (d) => {
        this.detalles.update((list) => [...list, d]);
        this.formulario = { id_reserva: 0, id_pasajero: 0 };
        this.mostrarFormulario = false;
      },
      error: (err) => this.error.set(err.error?.error ?? 'Error al crear detalle'),
    });
  }

  eliminar(id_reserva: number, id_pasajero: number): void {
    const userId = this.auth.usuario()!.id;
    this.api.eliminarDetalleViajero(userId, id_reserva, id_pasajero).subscribe({
      next: () => this.detalles.update((list) => list.filter((d) => !(d.id_reserva === id_reserva && d.id_pasajero === id_pasajero))),
      error: (err) => this.error.set(err.error?.error ?? 'Error al eliminar detalle'),
    });
  }
}
