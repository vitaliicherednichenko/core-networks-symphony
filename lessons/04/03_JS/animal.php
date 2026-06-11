<?php
// Clase Padre
class Animal {
    public $nombre;
    public function dormir() {
        echo $this->nombre . " dice: Zzz... Estoy durmiendo.\n";
    }
}
// Clase Hijo (Ahorra código, hereda todo lo del padre automáticamente)
class Perro extends Animal {
    public function ladrar() {
        echo $this->nombre . " dice: ¡Guau, guau!\n";
    }
}
// Probamos en el aula
$unPerro = new Perro();
$unPerro->nombre = "Pluto";
// ¡Atención! Puede dormir aunque en la clase Perro no hayamos escrito "dormir"
$unPerro->dormir(); // Funciona por herencia
$unPerro->ladrar(); // Funciona por especialización

?>
