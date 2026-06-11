<?php
class Coche {
    public $gasolina = 10;
    public function conducir() {
        if ($this->gasolina >= 4) {
            $this->gasolina = $this->gasolina - 4;
            echo "Viaje realizado con éxito.\n";
        } else {
            echo "¡Imposible arrancar! Sin combustible suficiente.\n";
        }
    }
}
$miAuto = new Coche();
$miAuto->conducir(); // Gasta 4 -> Quedan 6
$miAuto->conducir(); // Gasta 4 -> Quedan 2
$miAuto->conducir(); // Alerta: No hay suficiente

?>
