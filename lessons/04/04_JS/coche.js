// Diseña una clase llamada Coche que tenga un atributo público gasolina (número de
// litros, empieza en 10_JS). Añade una acción llamada conducir(). Cada vez que conduce, gasta 4 litros.
// Sin embargo, si al intentar conducir el coche tiene menos de 4 litros, no debe arrancar y debe mostrar
// un aviso en la pantalla: "¡Sin combustible suficiente!"

class Coche {
    gasolina = 10;

    conducir() {
        if (this.gasolina < 4) {
            console.log("¡Sin combustible suficiente!");
            return;
        }
        this.gasolina = this.gasolina - 4;
        console.log("Conduciendo... gasolina restante: " + this.gasolina);
    }
}

const coche = new Coche();

coche.conducir(); // Conduciendo... gasolina restante: 6
coche.conducir(); // Conduciendo... gasolina restante: 2
coche.conducir(); // ¡Sin combustible suficiente!
