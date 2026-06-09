class Cuenta {
    titular;
    saldo = 0;

    ingresar(cantidad) {
        this.saldo = this.saldo + cantidad;
    }
}

const cuenta = new Cuenta();
cuenta.titular = "Mario";

console.log("Saldo de " + cuenta.titular + ": " + cuenta.saldo); // Muestra 0

cuenta.ingresar(100);
console.log("Saldo de " + cuenta.titular + ": " + cuenta.saldo); // Muestra 100

cuenta.ingresar(50);
console.log("Saldo de " + cuenta.titular + ": " + cuenta.saldo); // Muestra 150
