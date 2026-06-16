import { Component, inject, signal, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthService);

  title = 'Sistema de Reservaciones';
  usuario = this.auth.usuario;
  isHome = signal(this.router.url === '/');

  ngOnInit(): void {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.isHome.set(this.router.url === '/');
    });
  }

  logout(): void {
    this.auth.logout();
  }
}
