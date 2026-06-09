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

coche.conducir(); // 10 -> 6
coche.conducir(); // 6 -> 2
coche.conducir(); // 2 < 4 -> "¡Sin combustible suficiente!"
