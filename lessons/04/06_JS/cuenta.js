// Imagina que abres una cuenta en el banco. El molde de la cuenta debe guardar el nombre del titular y el saldo,
// que siempre empieza en 0. Además, la cuenta debe saber realizar una acción llamada ingresar(cantidad),
// que sume ese dinero al saldo actual.

class Cuenta {
    titular;
    saldo = 0;

    ingresar(cantidad) {
        this.saldo = this.saldo + cantidad;
    }
}

const cuenta = new Cuenta();
cuenta.titular = "Mario";

console.log("Saldo de " + cuenta.titular + ": " + cuenta.saldo); // Saldo de Mario: 0

cuenta.ingresar(100);
console.log("Saldo de " + cuenta.titular + ": " + cuenta.saldo); // Saldo de Mario: 100

cuenta.ingresar(50);
console.log("Saldo de " + cuenta.titular + ": " + cuenta.saldo); // Saldo de Mario: 150
