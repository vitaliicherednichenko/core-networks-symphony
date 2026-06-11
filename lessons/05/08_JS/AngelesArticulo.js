class Articulo {
    // El constructor equivale al __construct de PHP
    constructor(referencia, existencias) {
        this.referencia = referencia;
        this.existencias = existencias;
    }

    // Métodos Getter
    getReferencia() {
        return this.referencia;
    }

    getExistencias() {
        return this.existencias;
    }

    // Método para reponer stock
    reponer(cantidad) {
        if (cantidad > 0) {
            this.existencias += cantidad;
        }
    }
}

// Pruebas e instanciación en memoria
const art1 = new Articulo("ART-100", 5);
const art2 = new Articulo("ART-200", 0);

art2.reponer(12); // En JS usamos el punto (.) para acceder a métodos: art2.reponer(12);
art2.reponer(12);

// Mostramos el resultado en consola usando Template Literals
console.log(`Articulo 1: ${art1.getReferencia()} - Stock: ${art1.getExistencias()}`);
