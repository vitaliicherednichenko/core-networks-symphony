<?php
class Articulo {
    private string $referencia;
    private int $existencias;
    public function __construct(string $referencia, int $existencias) {
        $this->referencia = $referencia;
        $this->existencias = $existencias;
    }
    public function getReferencia(): string { return $this->referencia; }
    public function getExistencias(): int { return $this->existencias; }
    public function reponer(int $cantidad): void {
        if ($cantidad > 0) { $this->existencias += $cantidad; }
    }
}
// Pruebas e instanciación en memoria
$art1 = new Articulo("ART-100", 5);
$art2 = new Articulo("ART-200", 0);
$art2->reponer(12);
echo "Articulo 1: " . $art1->getReferencia() . " - Stock: " . $art1->getExistencias() . "\n";

echo "Articulo 2: " . $art2->getReferencia() . " - Stock: " . $art2->getExistencias() . "\n";

?>
