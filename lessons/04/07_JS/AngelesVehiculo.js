class Vehiculo {
    marca;

    arrancar() {
        console.log(this.marca + " dice: ¡Vehículo en marcha!");
    }
}

// Clase Hijo (Hereda todo usando la palabra 'extends')
class CocheElectrico extends Vehiculo {
    autonomia = 400;

    cargar() {
        console.log("Cargando la batería de " + this.marca + " al 100%...");
    }
}

// Probamos la herencia
let miTesla = new CocheElectrico();
miTesla.marca = "Tesla Model 3";

// ¡Atención! Puede arrancar aunque en CocheElectrico no escribimos "arrancar"
miTesla.arrancar(); // Funciona por Herencia
miTesla.cargar();   // Funciona por Especialización
console.log("Autonomía: " + miTesla.autonomia + " km.");
