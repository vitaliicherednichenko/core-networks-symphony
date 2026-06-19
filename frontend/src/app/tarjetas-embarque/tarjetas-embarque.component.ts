import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ApiService, TarjetaEmbarque, NuevaTarjetaEmbarque } from '../api.service';
import { AuthService } from '../auth.service';
import { aEntradaFechaHora, desdeEntradaFechaHora } from '../fechas';

@Component({
  selector: 'app-tarjetas-embarque',
  imports: [RouterLink, FormsModule],
  templateUrl: './tarjetas-embarque.component.html',
  styleUrl: './tarjetas-embarque.component.css',
})
export class TarjetasEmbarqueComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  protected readonly aEntradaFechaHora = aEntradaFechaHora;
  protected readonly desdeEntradaFechaHora = desdeEntradaFechaHora;

  tarjetas = signal<TarjetaEmbarque[]>([]);
  error = signal<string | null>(null);
  esAdmin = computed(() => this.auth.usuario()?.role === 'admin');

  mostrarFormulario = false;
  formulario: NuevaTarjetaEmbarque = { id_reserva: 0, id_pasajero: 0, embarque: '', nro_vuelo: '', fecha_vuelo: '', clase: '', asiento: '', sala_embarque: '' };

  editando: TarjetaEmbarque | null = null;
  editForm: NuevaTarjetaEmbarque = { id_reserva: 0, id_pasajero: 0, embarque: '', nro_vuelo: '', fecha_vuelo: '', clase: '', asiento: '', sala_embarque: '' };

  ngOnInit(): void {
    this.api.tarjetasEmbarque().subscribe({
      next: (res) => this.tarjetas.set(res),
      error: (err) => this.error.set(err.message ?? 'Request failed'),
    });
  }

  agregar(): void {
    const userId = this.auth.usuario()!.id;
    this.api.crearTarjetaEmbarque(userId, this.formulario).subscribe({
      next: (t) => {
        this.tarjetas.update((list) => [...list, t]);
        this.formulario = { id_reserva: 0, id_pasajero: 0, embarque: '', nro_vuelo: '', fecha_vuelo: '', clase: '', asiento: '', sala_embarque: '' };
        this.mostrarFormulario = false;
      },
      error: (err) => this.error.set(err.error?.error ?? 'Error al crear tarjeta'),
    });
  }

  iniciarEdicion(t: TarjetaEmbarque): void {
    this.editando = t;
    this.editForm = { id_reserva: t.id_reserva, id_pasajero: t.id_pasajero, embarque: t.embarque, nro_vuelo: t.nro_vuelo, fecha_vuelo: t.fecha_vuelo, clase: t.clase, asiento: t.asiento, sala_embarque: t.sala_embarque };
  }

  guardarEdicion(): void {
    if (!this.editando) return;
    const userId = this.auth.usuario()!.id;
    this.api.actualizarTarjetaEmbarque(this.editando.id_tarjeta, userId, this.editForm).subscribe({
      next: (updated) => {
        this.tarjetas.update((list) => list.map((t) => (t.id_tarjeta === updated.id_tarjeta ? { ...updated, pasajero: t.pasajero } : t)));
        this.editando = null;
      },
      error: (err) => this.error.set(err.error?.error ?? 'Error al actualizar tarjeta'),
    });
  }

  cancelarEdicion(): void { this.editando = null; }

  eliminar(id: number): void {
    const userId = this.auth.usuario()!.id;
    this.api.eliminarTarjetaEmbarque(id, userId).subscribe({
      next: () => this.tarjetas.update((list) => list.filter((t) => t.id_tarjeta !== id)),
      error: (err) => this.error.set(err.error?.error ?? 'Error al eliminar tarjeta'),
    });
  }
}
