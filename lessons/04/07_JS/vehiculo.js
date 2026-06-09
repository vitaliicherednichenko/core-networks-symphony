class Vehiculo {
    marca;
    arrancar() {
        console.log(this.marca + " está arrancando... ¡En marcha!");
    }
}

class CocheElectrico extends Vehiculo {
    autonomia = 400;

    cargar() {
        console.log(this.marca + " cargando la batería. Autonomía: " + this.autonomia + " km");
    }
}

const tesla = new CocheElectrico();
tesla.marca = "Tesla";

tesla.arrancar(); // Heredado de Vehiculo
tesla.cargar();   // Propio de CocheElectrico
