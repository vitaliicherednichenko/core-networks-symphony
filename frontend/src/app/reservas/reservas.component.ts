import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ApiService, Reserva, NuevaReserva } from '../api.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reservas',
  imports: [RouterLink, FormsModule],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css',
})
export class ReservasComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  reservas = signal<Reserva[]>([]);
  error = signal<string | null>(null);
  esAdmin = computed(() => this.auth.usuario()?.role === 'admin');

  mostrarFormulario = false;
  formulario: NuevaReserva = { fecha_salida: '', fecha_retorno: '', nro_adultos: 1, nro_ninos: 0, nro_tercera_edad: 0, clase: '' };

  editando: Reserva | null = null;
  editForm: NuevaReserva = { fecha_salida: '', fecha_retorno: '', nro_adultos: 1, nro_ninos: 0, nro_tercera_edad: 0, clase: '' };

  ngOnInit(): void {
    this.api.reservas().subscribe({
      next: (res) => this.reservas.set(res),
      error: (err) => this.error.set(err.message ?? 'Request failed'),
    });
  }

  agregar(): void {
    const userId = this.auth.usuario()!.id;
    this.api.crearReserva(userId, this.formulario).subscribe({
      next: (r) => {
        this.reservas.update((list) => [...list, r]);
        this.formulario = { fecha_salida: '', fecha_retorno: '', nro_adultos: 1, nro_ninos: 0, nro_tercera_edad: 0, clase: '' };
        this.mostrarFormulario = false;
      },
      error: (err) => this.error.set(err.error?.error ?? 'Error al crear reserva'),
    });
  }

  iniciarEdicion(r: Reserva): void {
    this.editando = r;
    this.editForm = { fecha_salida: r.fecha_salida, fecha_retorno: r.fecha_retorno, nro_adultos: r.nro_adultos, nro_ninos: r.nro_ninos, nro_tercera_edad: r.nro_tercera_edad, clase: r.clase };
  }

  guardarEdicion(): void {
    if (!this.editando) return;
    const userId = this.auth.usuario()!.id;
    this.api.actualizarReserva(this.editando.id_reserva, userId, this.editForm).subscribe({
      next: (updated) => {
        this.reservas.update((list) => list.map((r) => (r.id_reserva === updated.id_reserva ? updated : r)));
        this.editando = null;
      },
      error: (err) => this.error.set(err.error?.error ?? 'Error al actualizar reserva'),
    });
  }

  cancelarEdicion(): void { this.editando = null; }

  eliminar(id: number): void {
    const userId = this.auth.usuario()!.id;
    this.api.eliminarReserva(id, userId).subscribe({
      next: () => this.reservas.update((list) => list.filter((r) => r.id_reserva !== id)),
      error: (err) => this.error.set(err.error?.error ?? 'Error al eliminar reserva'),
    });
  }
}
