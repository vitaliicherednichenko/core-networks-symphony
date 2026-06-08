import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';

export interface PingResponse {
  message: string;
  service: string;
  time: string;
}

export interface Vuelo {
  id: number;
  origen: string;
  destino: string;
  hora_salida: string;
  hora_llegada: string;
  aerolinea: string;
}

export interface Pasajero {
  id_pasajero: number;
  nro_pasaporte: string;
  apellido: string;
  nombre: string;
  fecha_nacimiento: string;
  sexo: string;
  direccion: string;
  telefono: string;
}

export interface Reserva {
  id_reserva: number;
  fecha_salida: string;
  fecha_retorno: string;
  nro_adultos: number;
  nro_ninos: number;
  nro_tercera_edad: number;
  clase: string;
}

export interface Boleto {
  id_boleto: number;
  id_pasajero: number;
  id_reserva: number;
  clase: string;
  precio: string;
  pasajero: string | null;
}

export interface DetalleViajero {
  id_reserva: number;
  id_pasajero: number;
  pasajero: string | null;
}

export interface Itinerario {
  id_reserva: number;
  trayecto: string;
  tramo: string;
  id_vuelo: number | null;
  fecha_vuelo: string;
  origen: string | null;
  destino: string | null;
  aerolinea: string | null;
}

export interface ListadoPasajeroVuelo {
  id_vuelo: number;
  id_pasajero: number;
  fecha: string;
  pasajero: string | null;
  origen: string | null;
  destino: string | null;
}

export interface TarjetaEmbarque {
  id_tarjeta: number;
  id_reserva: number;
  id_pasajero: number;
  embarque: string;
  nro_vuelo: string;
  fecha_vuelo: string;
  clase: string;
  asiento: string;
  sala_embarque: string;
  pasajero: string | null;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  ping(): Observable<PingResponse> {
    return this.http.get<PingResponse>(`${this.baseUrl}/ping`);
  }

  vuelos(): Observable<Vuelo[]> {
    return this.http.get<Vuelo[]>(`${this.baseUrl}/vuelos`);
  }

  pasajeros(): Observable<Pasajero[]> {
    return this.http.get<Pasajero[]>(`${this.baseUrl}/pasajeros`);
  }

  reservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.baseUrl}/reservas`);
  }

  boletos(): Observable<Boleto[]> {
    return this.http.get<Boleto[]>(`${this.baseUrl}/boletos`);
  }

  detallesViajeros(): Observable<DetalleViajero[]> {
    return this.http.get<DetalleViajero[]>(`${this.baseUrl}/detalles-viajeros`);
  }

  itinerarios(): Observable<Itinerario[]> {
    return this.http.get<Itinerario[]>(`${this.baseUrl}/itinerarios`);
  }

  listadoPasajerosVuelos(): Observable<ListadoPasajeroVuelo[]> {
    return this.http.get<ListadoPasajeroVuelo[]>(`${this.baseUrl}/listado-pasajeros-vuelos`);
  }

  tarjetasEmbarque(): Observable<TarjetaEmbarque[]> {
    return this.http.get<TarjetaEmbarque[]>(`${this.baseUrl}/tarjetas-embarque`);
  }
}
