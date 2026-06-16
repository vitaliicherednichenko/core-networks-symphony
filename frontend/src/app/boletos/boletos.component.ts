import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ApiService, Boleto, NuevoBoleto } from '../api.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-boletos',
  imports: [RouterLink, FormsModule],
  templateUrl: './boletos.component.html',
  styleUrl: './boletos.component.css',
})
export class BoletosComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  boletos = signal<Boleto[]>([]);
  error = signal<string | null>(null);
  esAdmin = computed(() => this.auth.usuario()?.role === 'admin');

  mostrarFormulario = false;
  formulario: NuevoBoleto = { id_pasajero: 0, id_reserva: 0, clase: '', precio: '' };

  editando: Boleto | null = null;
  editForm: NuevoBoleto = { id_pasajero: 0, id_reserva: 0, clase: '', precio: '' };

  ngOnInit(): void {
    this.api.boletos().subscribe({
      next: (res) => this.boletos.set(res),
      error: (err) => this.error.set(err.message ?? 'Request failed'),
    });
  }

  agregar(): void {
    const userId = this.auth.usuario()!.id;
    this.api.crearBoleto(userId, this.formulario).subscribe({
      next: (b) => {
        this.boletos.update((list) => [...list, b]);
        this.formulario = { id_pasajero: 0, id_reserva: 0, clase: '', precio: '' };
        this.mostrarFormulario = false;
      },
      error: (err) => this.error.set(err.error?.error ?? 'Error al crear boleto'),
    });
  }

  iniciarEdicion(b: Boleto): void {
    this.editando = b;
    this.editForm = { id_pasajero: b.id_pasajero, id_reserva: b.id_reserva, clase: b.clase, precio: b.precio };
  }

  guardarEdicion(): void {
    if (!this.editando) return;
    const userId = this.auth.usuario()!.id;
    this.api.actualizarBoleto(this.editando.id_boleto, userId, this.editForm).subscribe({
      next: (updated) => {
        this.boletos.update((list) => list.map((b) => (b.id_boleto === updated.id_boleto ? { ...updated, pasajero: b.pasajero } : b)));
        this.editando = null;
      },
      error: (err) => this.error.set(err.error?.error ?? 'Error al actualizar boleto'),
    });
  }

  cancelarEdicion(): void { this.editando = null; }

  eliminar(id: number): void {
    const userId = this.auth.usuario()!.id;
    this.api.eliminarBoleto(id, userId).subscribe({
      next: () => this.boletos.update((list) => list.filter((b) => b.id_boleto !== id)),
      error: (err) => this.error.set(err.error?.error ?? 'Error al eliminar boleto'),
    });
  }
}
