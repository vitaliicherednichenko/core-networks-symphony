import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

import { ApiService, Vuelo } from './api.service';
import { AuthService } from './auth.service';

const COLORES_AVATAR = ['#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#db2777'];

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
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
      next: (res) => this.vuelos.set(res),
      error: (err) => this.vuelosError.set(err.message ?? 'Error al cargar vuelos'),
    });
  }

  logout(): void {
    this.auth.logout();
  }
}
