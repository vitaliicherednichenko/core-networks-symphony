<?php
class MiembroComunidad {
    protected string $nombre;
    protected string $email;
    public function __construct(string $nombre, string $email) {
        $this->nombre = $nombre;
        $this->email = $email;
    }
    public function mostrarPerfil(): string {
        return "Nombre: {$this->nombre} | Email: {$this->email}";
    }
}
class Profesor extends MiembroComunidad {
    private string $departamento;
    public function __construct(string $nombre, string $email, string $departamento) {
        // Invocación explícita al constructor padre
        parent::__construct($nombre, $email);
        $this->departamento = $departamento;
    }
    // Redefinición polimórfica (Override)
    public function mostrarPerfil(): string {
        return parent::mostrarPerfil() . " | Depto: {$this->departamento}";
    }
}
