// Para ahorrar código, crearemos un molde general llamado Vehiculo que guarda la marca
// y tiene la acción común arrancar(). Luego, crearemos un molde específico llamado CocheElectrico.
// Queremos que el coche eléctrico herede todo lo del vehículo automáticamente,
// pero que añada una propiedad exclusiva llamada autonomia (por ejemplo, 400 km) y una acción exclusiva llamada cargar()

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

tesla.arrancar(); // Tesla está arrancando... ¡En marcha!
tesla.cargar();   // Tesla cargando la batería. Autonomía: 400 km
