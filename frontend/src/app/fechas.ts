/** "2024-01-15 10:30:00" -> "2024-01-15T10:30" (para mostrar en el input). */
export function aEntradaFechaHora(valor: string | null | undefined): string {
  return valor ? valor.replace(' ', 'T').slice(0, 16) : '';
}

/** "2024-01-15T10:30" -> "2024-01-15 10:30:00" (para enviar al backend). */
export function desdeEntradaFechaHora(valor: string | null | undefined): string {
  if (!valor) return '';
  const conSegundos = valor.length === 16 ? `${valor}:00` : valor;
  return conSegundos.replace('T', ' ');
}
