<?php
class Tarea {
    public string $titulo;
    public bool $completada;
    public function __construct(string $titulo, bool $completada = false) {
        $this->titulo = $titulo;
        $this->completada = $completada;
    }
}
class GestorTareas {
    private array $lista = []; // Colección lineal estructurada
    public function agregarTarea(Tarea $t): void {
        $this->lista[] = $t;
    }
    public function listarPendientes(): void {
        echo "=== TAREAS PENDIENTES ===\n";
        foreach ($this->lista as $tarea) {
            if (!$tarea->completada) {
                echo "- " . $tarea->titulo . "\n";
            }
        }
    }
}
// Caso de prueba en el aula
$gestor = new GestorTareas();

$gestor->agregarTarea(new Tarea("Diseñar esquema base de datos phpMyAdmin",
false));
$gestor->agregarTarea(new Tarea("Instalar bundles de Symfony AI", true));
$gestor->agregarTarea(new Tarea("Configurar puerto de Ollama", false));
$gestor->listarPendientes();

?>
