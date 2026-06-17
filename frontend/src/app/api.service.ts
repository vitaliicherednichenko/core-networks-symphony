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

export interface NuevoUsuario {
  nombre: string;
  email: string;
  password: string;
}

export interface Credenciales {
  email: string;
  password: string;
}

export interface NuevoVuelo {
  origen: string;
  destino: string;
  hora_salida: string;
  hora_llegada: string;
  aerolinea: string;
}

export interface NuevoPasajero {
  nro_pasaporte: string;
  apellido: string;
  nombre: string;
  fecha_nacimiento: string;
  sexo: string;
  direccion: string;
  telefono: string;
}

export interface NuevaReserva {
  fecha_salida: string;
  fecha_retorno: string;
  nro_adultos: number;
  nro_ninos: number;
  nro_tercera_edad: number;
  clase: string;
}

export interface NuevoBoleto {
  id_pasajero: number;
  id_reserva: number;
  clase: string;
  precio: string;
}

export interface NuevoDetalleViajero {
  id_reserva: number;
  id_pasajero: number;
}

export interface NuevoItinerario {
  id_reserva: number;
  trayecto: string;
  tramo: string;
  id_vuelo: number | null;
  fecha_vuelo: string;
}

export interface NuevoListadoPasajeroVuelo {
  id_vuelo: number;
  id_pasajero: number;
  fecha: string;
}

export interface NuevaTarjetaEmbarque {
  id_reserva: number;
  id_pasajero: number;
  embarque: string;
  nro_vuelo: string;
  fecha_vuelo: string;
  clase: string;
  asiento: string;
  sala_embarque: string;
}

export interface ActualizarUsuario {
  nombre: string;
  email: string;
  role: string;
  telefono?: string | null;
  password?: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  role: string;
  telefono: string | null;
  avatar: string | null;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  ping(): Observable<PingResponse> {
    return this.http.get<PingResponse>(`${this.baseUrl}/ping`);
  }

  usuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/usuarios`);
  }

  crearUsuario(usuario: NuevoUsuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}/usuarios`, usuario);
  }

  login(credenciales: Credenciales): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}/login`, credenciales);
  }

  vuelos(userId?: number): Observable<Vuelo[]> {
    const params = userId ? `?userId=${userId}` : '';
    return this.http.get<Vuelo[]>(`${this.baseUrl}/vuelos${params}`);
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

  crearVuelo(userId: number, vuelo: NuevoVuelo): Observable<Vuelo> {
    return this.http.post<Vuelo>(`${this.baseUrl}/vuelos`, { userId, ...vuelo });
  }

  actualizarVuelo(id: number, userId: number, vuelo: NuevoVuelo): Observable<Vuelo> {
    return this.http.put<Vuelo>(`${this.baseUrl}/vuelos/${id}`, { userId, ...vuelo });
  }

  eliminarVuelo(id: number, userId: number): Observable<void> {
    return this.http.request<void>('DELETE', `${this.baseUrl}/vuelos/${id}`, { body: { userId } });
  }

  // Pasajeros CRUD
  crearPasajero(userId: number, p: NuevoPasajero): Observable<Pasajero> {
    return this.http.post<Pasajero>(`${this.baseUrl}/pasajeros`, { userId, ...p });
  }

  actualizarPasajero(id: number, userId: number, p: NuevoPasajero): Observable<Pasajero> {
    return this.http.put<Pasajero>(`${this.baseUrl}/pasajeros/${id}`, { userId, ...p });
  }

  eliminarPasajero(id: number, userId: number): Observable<void> {
    return this.http.request<void>('DELETE', `${this.baseUrl}/pasajeros/${id}`, { body: { userId } });
  }

  // Reservas CRUD
  crearReserva(userId: number, r: NuevaReserva): Observable<Reserva> {
    return this.http.post<Reserva>(`${this.baseUrl}/reservas`, { userId, ...r });
  }

  actualizarReserva(id: number, userId: number, r: NuevaReserva): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.baseUrl}/reservas/${id}`, { userId, ...r });
  }

  eliminarReserva(id: number, userId: number): Observable<void> {
    return this.http.request<void>('DELETE', `${this.baseUrl}/reservas/${id}`, { body: { userId } });
  }

  // Boletos CRUD
  crearBoleto(userId: number, b: NuevoBoleto): Observable<Boleto> {
    return this.http.post<Boleto>(`${this.baseUrl}/boletos`, { userId, ...b });
  }

  actualizarBoleto(id: number, userId: number, b: NuevoBoleto): Observable<Boleto> {
    return this.http.put<Boleto>(`${this.baseUrl}/boletos/${id}`, { userId, ...b });
  }

  eliminarBoleto(id: number, userId: number): Observable<void> {
    return this.http.request<void>('DELETE', `${this.baseUrl}/boletos/${id}`, { body: { userId } });
  }

  // Detalles Viajeros CRUD
  crearDetalleViajero(userId: number, d: NuevoDetalleViajero): Observable<DetalleViajero> {
    return this.http.post<DetalleViajero>(`${this.baseUrl}/detalles-viajeros`, { userId, ...d });
  }

  eliminarDetalleViajero(userId: number, id_reserva: number, id_pasajero: number): Observable<void> {
    return this.http.request<void>('DELETE', `${this.baseUrl}/detalles-viajeros`, { body: { userId, id_reserva, id_pasajero } });
  }

  // Itinerarios CRUD
  crearItinerario(userId: number, it: NuevoItinerario): Observable<Itinerario> {
    return this.http.post<Itinerario>(`${this.baseUrl}/itinerarios`, { userId, ...it });
  }

  actualizarItinerario(userId: number, it: NuevoItinerario): Observable<Itinerario> {
    return this.http.put<Itinerario>(`${this.baseUrl}/itinerarios`, { userId, ...it });
  }

  eliminarItinerario(userId: number, id_reserva: number, trayecto: string, tramo: string): Observable<void> {
    return this.http.request<void>('DELETE', `${this.baseUrl}/itinerarios`, { body: { userId, id_reserva, trayecto, tramo } });
  }

  // Listado Pasajeros Vuelos CRUD
  crearListadoPasajeroVuelo(userId: number, l: NuevoListadoPasajeroVuelo): Observable<ListadoPasajeroVuelo> {
    return this.http.post<ListadoPasajeroVuelo>(`${this.baseUrl}/listado-pasajeros-vuelos`, { userId, ...l });
  }

  actualizarListadoPasajeroVuelo(userId: number, l: NuevoListadoPasajeroVuelo): Observable<ListadoPasajeroVuelo> {
    return this.http.put<ListadoPasajeroVuelo>(`${this.baseUrl}/listado-pasajeros-vuelos`, { userId, ...l });
  }

  eliminarListadoPasajeroVuelo(userId: number, id_vuelo: number, id_pasajero: number): Observable<void> {
    return this.http.request<void>('DELETE', `${this.baseUrl}/listado-pasajeros-vuelos`, { body: { userId, id_vuelo, id_pasajero } });
  }

  // Tarjetas Embarque CRUD
  crearTarjetaEmbarque(userId: number, t: NuevaTarjetaEmbarque): Observable<TarjetaEmbarque> {
    return this.http.post<TarjetaEmbarque>(`${this.baseUrl}/tarjetas-embarque`, { userId, ...t });
  }

  actualizarTarjetaEmbarque(id: number, userId: number, t: NuevaTarjetaEmbarque): Observable<TarjetaEmbarque> {
    return this.http.put<TarjetaEmbarque>(`${this.baseUrl}/tarjetas-embarque/${id}`, { userId, ...t });
  }

  eliminarTarjetaEmbarque(id: number, userId: number): Observable<void> {
    return this.http.request<void>('DELETE', `${this.baseUrl}/tarjetas-embarque/${id}`, { body: { userId } });
  }

  // Mis vuelos (usuario no admin)
  crearMiVuelo(userId: number, vuelo: NuevoVuelo): Observable<Vuelo> {
    return this.http.post<Vuelo>(`${this.baseUrl}/mis-vuelos`, { userId, ...vuelo });
  }

  actualizarMiVuelo(id: number, userId: number, vuelo: NuevoVuelo): Observable<Vuelo> {
    return this.http.put<Vuelo>(`${this.baseUrl}/mis-vuelos/${id}`, { userId, ...vuelo });
  }

  eliminarMiVuelo(userId: number, id: number): Observable<void> {
    return this.http.request<void>('DELETE', `${this.baseUrl}/mis-vuelos/${id}`, { body: { userId } });
  }

  // Perfil propio
  actualizarPerfil(userId: number, nombre: string, currentPassword?: string, newPassword?: string, telefono?: string | null): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/perfil`, { userId, nombre, currentPassword, newPassword, telefono });
  }

  subirAvatar(userId: number, archivo: File): Observable<{ avatar: string }> {
    const form = new FormData();
    form.append('userId', String(userId));
    form.append('avatar', archivo);
    return this.http.post<{ avatar: string }>(`${this.baseUrl}/perfil/avatar`, form);
  }

  // Usuarios CRUD (admin)
  actualizarUsuario(id: number, userId: number, u: ActualizarUsuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/usuarios/${id}`, { userId, ...u });
  }

  eliminarUsuario(id: number, userId: number): Observable<void> {
    return this.http.request<void>('DELETE', `${this.baseUrl}/usuarios/${id}`, { body: { userId } });
  }
}
