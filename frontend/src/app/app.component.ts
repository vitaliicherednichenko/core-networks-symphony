import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';

import { ApiService, Vuelo } from './api.service';
import { AuthService } from './auth.service';

const COLORES_AVATAR = ['#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#db2777'];

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthService);
  private api = inject(ApiService);

  title = 'Sistema de Reservaciones';
  usuario = this.auth.usuario;
  esAdmin = computed(() => this.auth.usuario()?.role === 'admin');
  isHome = signal(this.router.url === '/');

  vuelos = signal<Vuelo[]>([]);
  vuelosError = signal<string | null>(null);
  temperaturas = signal<Record<string, number | null>>({});

  // Búsqueda por origen y destino (usuarios regulares y visitantes)
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

  iniciales = computed(() => {
    const nombre = this.usuario()?.nombre?.trim() ?? '';
    if (nombre === '') return '?';
    const partes = nombre.split(/\s+/);
    const primera = partes[0]?.[0] ?? '';
    const segunda = partes.length > 1 ? partes[partes.length - 1][0] : '';
    return (primera + segunda).toUpperCase();
  });

  colorAvatar = computed(() => {
    const nombre = this.usuario()?.nombre ?? '';
    let hash = 0;
    for (let i = 0; i < nombre.length; i++) hash = (hash + nombre.charCodeAt(i)) % COLORES_AVATAR.length;
    return COLORES_AVATAR[hash];
  });

  ngOnInit(): void {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.isHome.set(this.router.url === '/');
    });

    if (!this.esAdmin()) {
      this.cargarVuelos();
    }
  }

  private cargarVuelos(): void {
    this.api.vuelos().subscribe({
      next: (res) => {
        this.vuelos.set(res);
        this.cargarTemperaturas(res);
      },
      error: (err) => this.vuelosError.set(err.message ?? 'Error al cargar vuelos'),
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

  logout(): void {
    this.auth.logout();
  }
}
