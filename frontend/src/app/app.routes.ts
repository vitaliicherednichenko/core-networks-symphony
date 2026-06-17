import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';
import { VuelosComponent } from './vuelos/vuelos.component';
import { PasajerosComponent } from './pasajeros/pasajeros.component';
import { ReservasComponent } from './reservas/reservas.component';
import { BoletosComponent } from './boletos/boletos.component';
import { DetallesViajerosComponent } from './detalles-viajeros/detalles-viajeros.component';
import { ItinerariosComponent } from './itinerarios/itinerarios.component';
import { ListadoPasajerosVuelosComponent } from './listado-pasajeros-vuelos/listado-pasajeros-vuelos.component';
import { TarjetasEmbarqueComponent } from './tarjetas-embarque/tarjetas-embarque.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PerfilComponent } from './perfil/perfil.component';

export const routes: Routes = [
  { path: 'perfil', component: PerfilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'vuelos', component: VuelosComponent },
  { path: 'pasajeros', component: PasajerosComponent },
  { path: 'reservas', component: ReservasComponent },
  { path: 'boletos', component: BoletosComponent },
  { path: 'detalles-viajeros', component: DetallesViajerosComponent },
  { path: 'itinerarios', component: ItinerariosComponent },
  { path: 'listado-pasajeros-vuelos', component: ListadoPasajerosVuelosComponent },
  { path: 'tarjetas-embarque', component: TarjetasEmbarqueComponent },
  { path: 'usuarios', component: UsuariosComponent },
];
