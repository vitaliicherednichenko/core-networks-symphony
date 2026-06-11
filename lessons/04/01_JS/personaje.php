<?php
// 1. Creamos el molde
class Personaje {
    public $nombre;
    public $vidas = 3; // Empieza con 3 vidas por defecto

    public function recibirDano() {
        $this->vidas = $this->vidas - 1; // $this significa "yo mismo"
    }
}

// 2. Creamos los objetos reales en memoria
$mario = new Personaje();
$mario->nombre = "Mario";

$luigi = new Personaje();
$luigi->nombre = "Luigi";

// 3. Jugamos con ellos
$mario->recibirDano(); // Mario pierde una vida

// 4. Mostramos el resultado en la pantalla
echo "Vidas de Mario: " . $mario->vidas . "\n"; // Mostrará 2
echo "Vidas de Luigi: " . $luigi->vidas . "\n"; // Mostrará 3

?>
