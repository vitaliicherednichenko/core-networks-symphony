import { Component, input } from '@angular/core';

import { maxDe, centroX, barX, barAncho } from '../graficos';

@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',
})
export class GraficoComponent {
  titulo = input<string>('');
  datos = input<{ nombre: string; total: number }[]>([]);

  maxDe = maxDe;
  centroX = centroX;
  barX = barX;
  barAncho = barAncho;
}
