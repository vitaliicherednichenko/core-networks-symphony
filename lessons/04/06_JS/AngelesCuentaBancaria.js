class CuentaBancaria {
    titular;
    saldo = 0; // Valor por defecto

    ingresar(cantidad) {
        // 'this' representa a la cuenta concreta que hace el ingreso
        this.saldo = this.saldo + cantidad;
    }
}

// 2. Usamos el molde para crear una cuenta real
let miCuenta = new CuentaBancaria();
miCuenta.titular = "Ana";

// 3. Ejecutamos la acción pasando un dato (parámetro)
miCuenta.ingresar(50);
miCuenta.ingresar(30);

// 4. Mostramos el resultado
console.log("Titular: " + miCuenta.titular);
console.log("Saldo final: " + miCuenta.saldo); // Muestra 80
