class Coche {
    gasolina = 10;

    conducir() {
        if (this.gasolina >= 4) {
            this.gasolina = this.gasolina - 4;
            console.log("Viaje realizado con éxito.");
        } else {
            console.log("¡Imposible arrancar! Sin combustible suficiente.");
        }
    }
}

const miAuto = new Coche();
miAuto.conducir(); // Gasta 4 -> Quedan 6
miAuto.conducir(); // Gasta 4 -> Quedan 2
miAuto.conducir(); // Alerta: ¡Imposible arrancar! Sin combustible suficiente.
