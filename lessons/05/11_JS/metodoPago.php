<?php
abstract class MetodoPago {
    public abstract function procesarPago(float $importe): string;
}
class PagoTarjeta extends MetodoPago {
    public function procesarPago(float $importe): string {
        return "Pago de {$importe}€ procesado con Tarjeta de Crédito.";
    }
}
class PagoBizum extends MetodoPago {
    public function procesarPago(float $importe): string {
        return "Pago de {$importe}€ procesado mediante Bizum de forma
instantánea.";
    }
}
// Demostración del polimorfismo dinámico
function ejecutarCobro(MetodoPago $pasarela, float $total) {
    echo $pasarela->procesarPago($total) . "\n";
}
$tarjeta = new PagoTarjeta();
$bizum = new PagoBizum();
ejecutarCobro($tarjeta, 45.50); // Mismo método, comportamiento diferente
ejecutarCobro($bizum, 12.00)

?>
