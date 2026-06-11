<?php
class Mascota {
    public $nombre;
    public $hambre = 10;
    public function comer() {
        // Explicar a los alumnos: $this representa al muñeco concreto que llama a la acción
        $this->hambre = $this->hambre - 2;
    }
}
// Creamos la mascota
$miMascota = new Mascota();
$miMascota->nombre = "Yoshi";
// Ejecutamos la acción
$miMascota->comer();
echo "El nivel de hambre de " . $miMascota->nombre . " ahora es: " . $miMascota->hambre; // Muestra 8

?>
