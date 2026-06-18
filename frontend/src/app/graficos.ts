export function agrupar<T>(items: T[], campo: keyof T): { nombre: string; total: number }[] {
  const conteo: Record<string, number> = {};
  for (const item of items) {
    const clave = String(item[campo]);
    conteo[clave] = (conteo[clave] ?? 0) + 1;
  }
  return Object.entries(conteo).map(([nombre, total]) => ({ nombre, total }));
}

export function maxDe(items: { total: number }[]): number {
  return Math.max(...items.map((e) => e.total), 1);
}

export function centroX(idx: number, n: number): number {
  return 30 + idx * (340 / n) + 340 / n / 2;
}

export function barX(idx: number, n: number): number {
  const slot = 340 / n;
  return 30 + idx * slot + slot * 0.15;
}

export function barAncho(n: number): number {
  return (340 / n) * 0.7;
}
