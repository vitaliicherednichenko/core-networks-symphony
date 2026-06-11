<?php

class Vehiculo {
    // En PHP debemos definir la propiedad (usamos public para que sea igual que en tu JS)
    public $marca;

    public function arrancar(): void {
        // Usamos $this-> para acceder a la propiedad y el punto (.) para concatenar texto
        echo $this->marca . " dice: ¡Vehículo en marcha!\n";
    }
}

// Clase Hijo (Hereda todo usando la palabra 'extends' igual que en JS)
class CocheElectrico extends Vehiculo {
    // Podemos asignarle un valor por defecto directamente
    public $autonomia = 400;

    public function cargar(): void {
        echo "Cargando la batería de " . $this->marca . " al 100%...\n";
    }
}

// === Probamos la herencia ===

// En PHP las variables empiezan con $ y se usa 'new' de forma similar
$miTesla = new CocheElectrico();
$miTesla->marca = "Tesla Model 3";

// ¡Atención! Usamos el operador -> en lugar del punto (.) para llamar a los métodos
$miTesla->arrancar(); // Funciona por Herencia
$miTesla->cargar();   // Funciona por Especialización
echo "Autonomía: " . $miTesla->autonomia . " km.\n";

?>
