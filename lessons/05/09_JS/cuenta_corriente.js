// Modifica o crea una clase CuentaCorriente que proteja un atributo privado saldo(float).
// El constructor debe inicializar el saldo a cero automáticamente.
// Implementa:
// • Un método ingresar(cantidad) . No debe permitir el ingreso si la cantidad es negativa o cero.
// • Un método saldo retirar(float cantidad) . No debe permitir la retirada si la cantidad supera al
//      saldo disponible o si es negativa.
// Debe retornar un valor booleano indicando si la operación fue autorizada.

class CuentaCorriente {
    #saldo;

    constructor() {
        this.#saldo = 0;
    }

    getSaldo() {
        return this.#saldo;
    }

    ingresar(cantidad) {
        if (cantidad <= 0) {
            return false;
        }
        this.#saldo = this.#saldo + cantidad;
        return true;
    }

    retirar(cantidad) {
        if (cantidad < 0 || cantidad > this.#saldo) {
            return false;
        }
        this.#saldo = this.#saldo - cantidad;
        return true;
    }
}

const cuenta = new CuentaCorriente();

console.log("Saldo inicial: " + cuenta.getSaldo());                   // Saldo inicial: 0

console.log("ingresar(100): " + cuenta.ingresar(100));       // ingresar(100): true
console.log("ingresar(-50): " + cuenta.ingresar(-50));       // ingresar(-50): false
console.log("ingresar(0):   " + cuenta.ingresar(0));         // ingresar(0):   false

console.log("retirar(30):   " + cuenta.retirar(30));         // retirar(30):   true
console.log("retirar(999):  " + cuenta.retirar(999));        // retirar(999):  false
console.log("retirar(-10_JS):  " + cuenta.retirar(-10));     // retirar(-10):  false

console.log("Saldo final: " + cuenta.getSaldo());                     // Saldo final: 70
