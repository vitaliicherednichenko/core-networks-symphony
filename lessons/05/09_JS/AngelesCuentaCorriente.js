class CuentaBancaria {
    // Propiedad privada (el '#' impide que se modifique desde fuera de la clase)
    #saldo;

    constructor(saldoInicial = 0) {
        this.#saldo = saldoInicial;
    }

    // Método 'getter' para leer el saldo
    get saldo() {
        return this.#saldo;
    }

    // Método para ingresar dinero
    ingresar(cantidad) {
        if (cantidad > 0) {
            this.#saldo += cantidad;
        }
    }

    // Método para retirar dinero (devuelve true o false)
    retirar(cantidad) {
        if (cantidad > 0 && cantidad <= this.#saldo) {
            this.#saldo -= cantidad;
            return true;
        }
        return false;
    }
}

const miCuenta = new CuentaBancaria(100); // Iniciamos con 100

miCuenta.ingresar(50);
console.log(miCuenta.saldo); // Imprime: 150

const exito = miCuenta.retirar(30);
console.log(exito);          // Imprime: true
console.log(miCuenta.saldo); // Imprime: 120

// Intentar hacer un truco no funcionará:
// miCuenta.#saldo = 1000000; // ❌ Error de sintaxis: Propiedad privada
