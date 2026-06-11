<?php
class ValidadorSensor {
    public static function analizarTemperatura(float $grados): void {
        if ($grados < -50 || $grados > 100) {
            throw new RangeException("Temperatura fuera del rango crítico
operativo del hardware.");
        }
        echo "Temperatura de {$grados}°C dentro de la normalidad.\n";
    }
}
// Captura estructurada del error
try {
    ValidadorSensor::analizarTemperatura(150.0);
} catch (RangeException $e) {
    echo "ERROR CONTROLADO: " . $e->getMessage() . "\n";
}

?>
