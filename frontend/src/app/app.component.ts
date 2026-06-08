import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JsonPipe } from '@angular/common';

import { ApiService, PingResponse } from './api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private api = inject(ApiService);

  title = 'frontend';
  ping = signal<PingResponse | null>(null);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadPing();
  }

  loadPing(): void {
    this.error.set(null);
    this.api.ping().subscribe({
      next: (res) => this.ping.set(res),
      error: (err) => this.error.set(err.message ?? 'Request failed'),
    });
  }
}
