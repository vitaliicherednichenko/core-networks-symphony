<?php

class CuentaBancaria {
    // En PHP, es necesario definir las propiedades con su visibilidad (public, private, etc.)
    public $titular;
    public $saldo = 0; // Valor por defecto

    public function ingresar(float $cantidad): void {
        // '$this' representa a la cuenta concreta que hace el ingreso
        // Usamos -> en lugar de . para acceder a las propiedades
        $this->saldo = $this->saldo + $cantidad;
    }
}

// 2. Usamos el molde para crear una cuenta real
$miCuenta = new CuentaBancaria();
$miCuenta->titular = "Ana";

// 3. Ejecutamos la acción pasando un dato (parámetro)
$miCuenta->ingresar(50);
$miCuenta->ingresar(30);

// 4. Mostramos el resultado
// Usamos echo para imprimir en pantalla y el punto (.) para concatenar textos
echo "Titular: " . $miCuenta->titular . "\n";
echo "Saldo final: " . $miCuenta->saldo . "\n"; // Muestra 80

?>
