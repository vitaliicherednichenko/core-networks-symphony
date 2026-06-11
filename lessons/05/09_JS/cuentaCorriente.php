<?php
class CuentaCorriente {
    private float $saldo = 0.0;
    public function getSaldo(): float { return $this->saldo; }
    public function ingresar(float $cantidad): void {
        if ($cantidad > 0) { $this->saldo += $cantidad; }
    }
    public function retirar(float $cantidad): bool {
        if ($cantidad > 0 && $cantidad <= $this->saldo) {
            $this->saldo -= $cantidad;
            return true;
        }
        return false;
    }
}
