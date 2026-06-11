<?php
class Playlist {
    public $nombre;
    public $canciones = []; // Lista vacía de textos
    public function agregarCancion($titulo) {
        $this->canciones[] = $titulo; // Añade el texto al final de la lista
    }
    public function reproducirTodo() {
        echo "Reproduciendo la lista: " . $this->nombre . "\n";
        // Recorremos la lista de una en una usando un bucle
        foreach ($this->canciones as $cancion) {
            echo "- Sonando ahora: " . $cancion . "\n";
        }
    }
}
$miMusica = new Playlist();
$miMusica->nombre = "Favoritas de Clase";
$miMusica->agregarCancion("Symfony Theme");
$miMusica->agregarCancion("Ollama Rock");
$miMusica->reproducirTodo()

?>
