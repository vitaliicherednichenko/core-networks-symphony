class MiembroComunidad {
    // Las propiedades privadas se definen con #
    #nombre;
    #email;

    constructor(nombre, email) {
        this.#nombre = nombre;
        this.#email = email;
    }

    mostrarPerfil() {
        // Usamos Template Literals (` `) igual que en PHP
        return `Nombre: ${this.#nombre} | Email: ${this.#email}`;
    }
}

class Profesor extends MiembroComunidad {
    #departamento;

    constructor(nombre, email, departamento) {
        // 'super' equivale a parent::__construct en PHP y debe ir primero
        super(nombre, email);
        this.#departamento = departamento;
    }

    // Redefinición polimórfica (Override)
    mostrarPerfil() {
        // 'super.mostrarPerfil()' equivale a parent::mostrarPerfil()
        return `${super.mostrarPerfil()} | Depto: ${this.#departamento}`;
    }
}
