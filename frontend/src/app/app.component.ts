import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {
  ApiService,
  Vuelo,
  Pasajero,
  Reserva,
  Boleto,
  DetalleViajero,
  Itinerario,
  ListadoPasajeroVuelo,
  TarjetaEmbarque,
} from './api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private api = inject(ApiService);

  title = 'Sistema de Reservaciones';
  vuelos = signal<Vuelo[]>([]);
  pasajeros = signal<Pasajero[]>([]);
  reservas = signal<Reserva[]>([]);
  boletos = signal<Boleto[]>([]);
  detallesViajeros = signal<DetalleViajero[]>([]);
  itinerarios = signal<Itinerario[]>([]);
  listadoPasajerosVuelos = signal<ListadoPasajeroVuelo[]>([]);
  tarjetasEmbarque = signal<TarjetaEmbarque[]>([]);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.error.set(null);
    this.api.vuelos().subscribe({
      next: (res) => this.vuelos.set(res),
      error: (err) => this.error.set(err.message ?? 'Request failed'),
    });
    this.api.pasajeros().subscribe({
      next: (res) => this.pasajeros.set(res),
      error: (err) => this.error.set(err.message ?? 'Request failed'),
    });
    this.api.reservas().subscribe({
      next: (res) => this.reservas.set(res),
      error: (err) => this.error.set(err.message ?? 'Request failed'),
    });
    this.api.boletos().subscribe({
      next: (res) => this.boletos.set(res),
      error: (err) => this.error.set(err.message ?? 'Request failed'),
    });
    this.api.detallesViajeros().subscribe({
      next: (res) => this.detallesViajeros.set(res),
      error: (err) => this.error.set(err.message ?? 'Request failed'),
    });
    this.api.itinerarios().subscribe({
      next: (res) => this.itinerarios.set(res),
      error: (err) => this.error.set(err.message ?? 'Request failed'),
    });
    this.api.listadoPasajerosVuelos().subscribe({
      next: (res) => this.listadoPasajerosVuelos.set(res),
      error: (err) => this.error.set(err.message ?? 'Request failed'),
    });
    this.api.tarjetasEmbarque().subscribe({
      next: (res) => this.tarjetasEmbarque.set(res),
      error: (err) => this.error.set(err.message ?? 'Request failed'),
    });
  }
}
