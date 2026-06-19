import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ApiService, Vuelo, NuevoVuelo } from '../api.service';
import { AuthService } from '../auth.service';
import { agrupar } from '../graficos';
import { GraficoComponent } from '../grafico/grafico.component';
import { aEntradaFechaHora, desdeEntradaFechaHora } from '../fechas';

@Component({
  selector: 'app-vuelos',
  imports: [RouterLink, FormsModule, GraficoComponent],
  templateUrl: './vuelos.component.html',
  styleUrl: './vuelos.component.css',
})
export class VuelosComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  protected readonly aEntradaFechaHora = aEntradaFechaHora;
  protected readonly desdeEntradaFechaHora = desdeEntradaFechaHora;

  vuelos = signal<Vuelo[]>([]);
  error = signal<string | null>(null);
  usuario = this.auth.usuario;
  esAdmin = computed(() => this.auth.usuario()?.role === 'admin');

  // Búsqueda por origen y destino (disponible para todos)
  filtroOrigen = signal('');
  filtroDestino = signal('');

  vuelosFiltrados = computed(() => {
    const origen = this.filtroOrigen().trim().toLowerCase();
    const destino = this.filtroDestino().trim().toLowerCase();
    return this.vuelos().filter((v) =>
      v.origen.toLowerCase().includes(origen) &&
      v.destino.toLowerCase().includes(destino)
    );
  });

  // Temperaturas por coordenada ("lat,lon" -> °C), cargadas de forma asíncrona
  temperaturas = signal<Record<string, number | null>>({});

  // Charts
  porAerolinea = computed(() => agrupar(this.vuelosFiltrados(), 'aerolinea'));
  porOrigen = computed(() => agrupar(this.vuelosFiltrados(), 'origen'));
  porDestino = computed(() => agrupar(this.vuelosFiltrados(), 'destino'));

  // Add form
  mostrarFormulario = false;
  formulario: NuevoVuelo = this.formularioVacio();

  // Edit state
  editando: Vuelo | null = null;
  editForm: NuevoVuelo = this.formularioVacio();

  private formularioVacio(): NuevoVuelo {
    return {
      origen: '', destino: '', hora_salida: '', hora_llegada: '', aerolinea: '',
      origen_lat: null, origen_lon: null, destino_lat: null, destino_lon: null,
    };
  }

  ngOnInit(): void {
    this.cargarVuelos();
  }

  cargarVuelos(): void {
    // Todos (admins, usuarios y visitantes) ven y pueden buscar el catálogo completo de vuelos.
    this.api.vuelos().subscribe({
      next: (res) => {
        this.vuelos.set(res);
        this.cargarTemperaturas(res);
      },
      error: (err) => this.error.set(err.message ?? 'Request failed'),
    });
  }

  temperaturaDe(lat: number | null, lon: number | null): number | null {
    if (lat === null || lon === null) return null;
    return this.temperaturas()[`${lat},${lon}`] ?? null;
  }

  private cargarTemperaturas(vuelos: Vuelo[]): void {
    const claves = new Set<string>();
    for (const v of vuelos) {
      if (v.origen_lat !== null && v.origen_lon !== null) claves.add(`${v.origen_lat},${v.origen_lon}`);
      if (v.destino_lat !== null && v.destino_lon !== null) claves.add(`${v.destino_lat},${v.destino_lon}`);
    }

    for (const clave of claves) {
      if (clave in this.temperaturas()) continue;
      const [lat, lon] = clave.split(',').map(Number);
      this.api.clima(lat, lon).subscribe({
        next: (res) => this.temperaturas.update((t) => ({ ...t, [clave]: res.temperatura })),
        error: () => this.temperaturas.update((t) => ({ ...t, [clave]: null })),
      });
    }
  }

  agregarVuelo(): void {
    this.error.set(null);
    const userId = this.auth.usuario()!.id;

    const obs = this.esAdmin()
      ? this.api.crearVuelo(userId, this.formulario)
      : this.api.crearMiVuelo(userId, this.formulario);

    obs.subscribe({
      next: () => {
        this.cargarVuelos();
        this.formulario = this.formularioVacio();
        this.mostrarFormulario = false;
      },
      error: (err) => this.error.set(err.error?.error ?? 'Error al crear vuelo'),
    });
  }

  iniciarEdicion(v: Vuelo): void {
    this.editando = v;
    this.editForm = {
      origen: v.origen, destino: v.destino, hora_salida: v.hora_salida, hora_llegada: v.hora_llegada, aerolinea: v.aerolinea,
      origen_lat: v.origen_lat, origen_lon: v.origen_lon, destino_lat: v.destino_lat, destino_lon: v.destino_lon,
    };
  }

  guardarEdicion(): void {
    if (!this.editando) return;
    this.error.set(null);
    const userId = this.auth.usuario()!.id;

    const obs = this.esAdmin()
      ? this.api.actualizarVuelo(this.editando.id, userId, this.editForm)
      : this.api.actualizarMiVuelo(this.editando.id, userId, this.editForm);

    obs.subscribe({
      next: () => {
        this.cargarVuelos();
        this.editando = null;
      },
      error: (err) => this.error.set(err.error?.error ?? 'Error al actualizar vuelo'),
    });
  }

  cancelarEdicion(): void {
    this.editando = null;
  }

  eliminarVuelo(id: number): void {
    this.error.set(null);
    const userId = this.auth.usuario()!.id;

    const obs = this.esAdmin()
      ? this.api.eliminarVuelo(id, userId)
      : this.api.eliminarMiVuelo(userId, id);

    obs.subscribe({
      next: () => this.vuelos.update((list) => list.filter((v) => v.id !== id)),
      error: (err) => this.error.set(err.error?.error ?? 'Error al eliminar vuelo'),
    });
  }
}
