// Crea una clase llamada Articulo para el inventario de un almacén.
// La clase debe tener:
//  • Atributos privados:  referencia (cadena) y existencias (entero).
//  • Un método constructor que reciba la referencia y el número de existencias iniciales.
//  • Métodos públicos (getters) para consultar ambos atributos.
//  • Un método público reponer(int cantidad) que incremente las existencias del artículo.
// Instancia dos objetos de la clase (un artículo con referencia "ART-100" y 5 unidades, y otro "ART-200" con 0 unidades).
// Llama al método reponer() en el segundo artículo sumando 12 unidades e imprime por pantalla el estado de ambos

class Articulo {
    #referencia;
    #existencias;

    constructor(referencia, existencias) {
        this.#referencia = referencia;
        this.#existencias = existencias;
    }

    getReferencia() {
        return this.#referencia;
    }

    getExistencias() {
        return this.#existencias;
    }

    reponer(cantidad) {
        this.#existencias = this.#existencias + cantidad;
    }
}

const item1 = new Articulo("ART-100", 5);
const item2 = new Articulo("ART-200", 0);

item2.reponer(12);

console.log("Articulo: " + item1.getReferencia() + " | existencias: " + item1.getExistencias()); // Articulo: ART-100 | existencias: 5
console.log("Articulo: " + item2.getReferencia() + " | existencias: " + item2.getExistencias()); // Articulo: ART-200 | existencias: 12
